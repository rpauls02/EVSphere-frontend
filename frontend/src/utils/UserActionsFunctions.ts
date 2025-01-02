import { auth, db } from '../firebaseConfig';
import { collection, query, where, setDoc, getDocs, doc, updateDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export const addChargingSession = async (
    sessionDate: string,
    sessionTime: string
) => {
    const user = auth.currentUser;
    if (user) {
        try {
            const bookedAt = new Date(`${sessionDate}T${sessionTime}`);
            const sessionID = 'ssn_' + Math.random().toString(36).substring(2, 12);

            const session = {
                sessionID: sessionID,
                bookedAt: Timestamp.fromDate(bookedAt),
                createdAt: serverTimestamp(),
                duration: 0,
                energy_consumed: 0,
                status: "waiting",
                userID: user.uid
            };

            const docRef = await addDoc(collection(db, 'sessions'), session);

            console.log('Charging session created with ID:', docRef.id);
            return { message: 'Charging session created successfully.', bookingId: docRef.id };
        } catch (error) {
            console.error('Error creating booking:', error);
            throw new Error('Failed to create booking.');
        }
    }
};

export const cancelChargingSession = async (
    sessionDate: string,
    sessionTime: string
) => {
    const user = auth.currentUser;
    if (user) {
        try {
            const bookedAt = new Date(`${sessionDate}T${sessionTime}`);

            const sessionsRef = collection(db, 'sessions');
            const querySnapshot = await getDocs(
                query(sessionsRef,
                    where('userID', '==', user.uid),
                    where('bookedAt', '==', bookedAt)
                )
            );

            if (!querySnapshot.empty) {
                const sessionDoc = querySnapshot.docs[0];
                await updateDoc(sessionDoc.ref, { status: 'cancelled' });

                console.log('Charging session cancelled with ID:', sessionDoc.id);
                return { message: 'Charging session cancelled successfully.', bookingId: sessionDoc.id };
            } else {
                throw new Error('Session not found or does not match the given date and time.');
            }
        } catch (error) {
            console.error('Error cancelling session:', error);
            throw new Error('Failed to cancel the session.');
        }
    }
};

export const addChargingPoint = async (
    address: string,
    access: string,
    connector_count: number,
    connector_type: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const user = auth.currentUser;
    if (user) {
        setLoading(true);
        try {
            const chargingPointsRef = collection(db, 'charging_points');

            const userChargersQuery = query(chargingPointsRef, 
                where('userID', '==', user.uid),
            );
            const chargersSnapshot = await getDocs(userChargersQuery);

            const existingIds = chargersSnapshot.docs.map((doc) => doc.id);
            let nextChargerId = 1;
            let chargerId = `charger_${String(nextChargerId).padStart(3, '0')}`;

            while (existingIds.includes(chargerId)) {
                nextChargerId++;
                chargerId = `charger_${String(nextChargerId).padStart(3, '0')}`;
            }

            const connectorFields: { [key: string]: string } = {};

            for (let j = 0; j < connector_count; j++) {
                connectorFields[`conn${j + 1}_id`] = `cntr_${String(j + 1).padStart(3, '0')}`;
                connectorFields[`conn${j + 1}_type`] = connector_type;
            }

            const charging_point = {
                userID: user.uid,
                address: address,
                access: access,
                id: chargerId,
                status: 'available',
                connector_count: connector_count,
                ...connectorFields,
            };

            const chargerDocRef = await addDoc(collection(db, 'charging_points'), charging_point);

            for (let j = 0; j < connector_count; j++) {
                const connector_data = {
                    id: `conn_${String(j + 1).padStart(3, '0')}`,
                    type: connector_type,
                    status: 'available',
                }
                const connectorDocRef = await addDoc(collection(chargerDocRef, 'connectors'), connector_data);
            }
        } catch (error) {
            setError('Failed to add the charging point. Please try again.');
            console.error('Error adding the charging point:', error);
        } finally {
            setLoading(false);
        }
    } else {
        setError('User not authenticated. Please log in and try again.');
    }
};

export const removeChargingPoint = async (
    address: string,
    addressAccess: string,
    chargerCount: number,
    connectorTypes: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: () => void
) => {
    const user = auth.currentUser;

    if (user) {
        try {
            setLoading(true);

            const chargersRef = collection(db, 'charging_points');
            const chargersSnapshot = await getDocs(chargersRef);
            const existingIds = chargersSnapshot.docs.map((doc) => doc.id);

            let nextChargerId = 1;

            for (let i = 0; i < chargerCount; i++) {
                let currentChargerId = `charger_00${nextChargerId}`;
                while (existingIds.includes(currentChargerId)) {
                    nextChargerId++;
                    currentChargerId = `charger_00${nextChargerId}`;
                }

                // Create the main charging point document
                const chargerData = {
                    userID: user.uid,
                    address,
                    addressAccess,
                    chargerID: currentChargerId,
                    status: 'available',
                };

                const chargerDocRef = doc(chargersRef);
                await setDoc(chargerDocRef, chargerData);

                // Create a subcollection for connectors under this charging point
                const connectorsRef = collection(chargerDocRef, 'connectors');

                // Split the connector types and create up to 2 connectors
                const connectorTypeList = connectorTypes.split(',');
                for (let j = 0; j < Math.min(2, connectorTypeList.length); j++) {
                    const connectorData = {
                        connectorID: `cntr_${String(j + 1).padStart(3, '0')}`,
                        type: connectorTypeList[j],
                        status: 'available',
                    };

                    // Add the connector document to the subcollection
                    await addDoc(connectorsRef, connectorData);
                }

                nextChargerId++;
            }

            onSuccess();
        } catch (error) {
            setError('Failed to add charging points. Please try again.');
            console.error('Error creating charging points:', error);
        } finally {
            setLoading(false);
        }
    } else {
        setError('User not authenticated. Please log in and try again.');
    }
};

export const updateUserCreditBalance = async (newCreditBalance: number): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return false;
    }

    try {
        const balanceCollectionRef = collection(db, "balances");
        const balanceQuery = query(balanceCollectionRef, where("userID", "==", user.uid));
        const querySnapshot = await getDocs(balanceQuery);

        if (!querySnapshot.empty) {
            const balanceDoc = querySnapshot.docs[0];
            const balanceRef = doc(db, "balances", balanceDoc.id);

            await updateDoc(balanceRef, {
                credit_balance: newCreditBalance,
            });

            console.log("User credit balance updated successfully.");
            return true;
        } else {
            console.error("No balance record found for the user.");
            return false;
        }
    } catch (error) {
        console.error("Error updating user balance in Firestore:", error);
        return false;
    }
}


