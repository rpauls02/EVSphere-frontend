import { auth, db } from '../firebaseConfig';
import { doc, getDocs, getDoc, collection, query, orderBy, limit, where } from 'firebase/firestore';

export interface UserBalance {
    pointsBalance: number;
    creditsBalance: number;
}

export interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
}

export interface RecentSessionData {
    bookedAt: any;
    duration: number;
    energy_consumed: number;
}

export interface UpcomingSessionData {
    bookedAt: any;
}

export const fetchUserDetails = async (): Promise<UserDetails | null> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return null;
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                mobile: userData.mobile || ''
            };
        } else {
            console.error("Could not find user record.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
        return null;
    }
};

export const fetchUserBalance = async (): Promise<UserBalance | null> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return null;
    }

    try {
        const balanceCollectionRef = collection(db, "balance");
        const balanceQuery = query(balanceCollectionRef, where("userID", "==", user.uid));
        const querySnapshot = await getDocs(balanceQuery);

        if (!querySnapshot.empty) {
            const balanceDoc = querySnapshot.docs[0];
            const balanceData = balanceDoc.data();

            return {
                pointsBalance: balanceData.points_balance || 0,
                creditsBalance: balanceData.credit_balance || 0,
            };
        } else {
            console.error("No balance record found for the user.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user balance from Firestore:", error);
        return null;
    }
}

export const fetchUserMessages = async (): Promise<string[]> => {
    const user = auth.currentUser;

    if (!user) {
        console.error("No authenticated user found.");
        return [];
    }

    try {
        const userMessagesRef = collection(db, "messages");

        const messagesQuery = query(
            userMessagesRef,
            where("recipient", "==", user.uid),
            orderBy("received", "desc"),
            limit(5)
        );

        const querySnapshot = await getDocs(messagesQuery);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return data.content;
        });
    } catch (error) {
        console.error("Error fetching user messages from Firestore:", error);
        return [];
    }
};

export const fetchRecentChargingSessions = async (): Promise<RecentSessionData[]> => {
    const user = auth.currentUser;

    if (!user) {
        console.warn("No user is currently logged in.");
        return [];
    }

    try {
        const userSessionsRef = collection(db, "sessions");

        const sessionsQuery = query(
            userSessionsRef,
            where("userID", "==", user.uid),
            where ("status", "==", "complete"),
            orderBy("bookedAt", "desc"),
            limit(5)
        );

        const querySnapshot = await getDocs(sessionsQuery);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                bookedAt: data.bookedAt,
                duration: data.duration,
                energy_consumed: data.energy_consumed,
            };

        });
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        throw error;
    }
};

export const fetchUpcomingChargingSessions = async (): Promise<UpcomingSessionData[]> => {
    const user = auth.currentUser;

    if (!user) {
        console.warn("No user is currently logged in.");
        return [];
    }

    try {
        const userSessionsRef = collection(db, "sessions");

        const sessionsQuery = query(
            userSessionsRef,
            where("userID", "==", user.uid),
            where ("status", "==", "waiting"),
            orderBy("bookedAt", "desc"),
            limit(5)
        );

        const querySnapshot = await getDocs(sessionsQuery);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                bookedAt: data.bookedAt,
            };

        });
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        throw error;
    }
};
