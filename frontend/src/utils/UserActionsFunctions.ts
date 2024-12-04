import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

export const addChargingSession = async (sessionDate: string, sessionTime: string) => {
    try {
        const userID = auth.currentUser?.uid;
        const bookedAt = new Date(`${sessionDate}T${sessionTime}`);
        const sessionID = 'session_' + Math.random().toString(36).substring(2, 12);

        const session = {
            sessionID: sessionID,
            bookedAt: bookedAt,
            createdAt: serverTimestamp(),
            duration: 0,
            energy_consumed: 0,
            status: 'waiting',
            userID: userID,
        };

        const docRef = await addDoc(collection(db, 'sessions'), session);

        console.log('Charging session created with ID:', docRef.id);
        return { message: 'Charging session created successfully.', bookingId: docRef.id };
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking.');
    }
};


export const updateUserCreditBalance = async (newCreditBalance: number): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return false;
    }

    try {
        const balanceCollectionRef = collection(db, "balance");
        const balanceQuery = query(balanceCollectionRef, where("userID", "==", user.uid));
        const querySnapshot = await getDocs(balanceQuery);

        if (!querySnapshot.empty) {
            const balanceDoc = querySnapshot.docs[0];
            const balanceRef = doc(db, "balance", balanceDoc.id);

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


