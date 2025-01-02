import { auth, db } from '../firebaseConfig';
import { doc, getDocs, getDoc, collection, query, orderBy, limit, where } from 'firebase/firestore';
import axios from 'axios';
import { UserDetails, UserMessage, UserAddress, UserBalance, UserCharger, UpcomingSessionData, PastSessionData, PastMessageData, UserTransaction } from './types';

/** Fetch user details from Firestore */
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
                userName: userData.userName || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                mobile: userData.mobile || '',
                role: userData.role || '',
                stripe_cid: userData.stripe_cID || ''
            };
        } else {
            console.error("User record not found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
};

/** Fetch user addresses from Firestore */
export const fetchUserAddresses = async (): Promise<UserAddress[] | null> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return null;
    }

    try {
        const addressesCollectionRef = collection(db, "addresses");
        const addressesQuery = query(addressesCollectionRef, where("userID", "==", user.uid));
        const querySnapshot = await getDocs(addressesQuery);

        const addresses: UserAddress[] = querySnapshot.docs.map(doc => {
            const userData = doc.data();
            return {
                userID: userData.userID || '',
                number: userData.number || '',
                street: userData.street || '',
                town: userData.town || '',
                postcode: userData.postcode || '',
                other: userData.other || ''
            };
        });

        return addresses.length > 0 ? addresses : null;
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        return null;
    }
};

/** Fetch user balances from Firestore */
export const fetchUserBalance = async (): Promise<UserBalance | null> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return null;
    }

    try {
        const balanceCollectionRef = collection(db, "balances");
        const balanceQuery = query(balanceCollectionRef, where("userID", "==", user.uid));
        const querySnapshot = await getDocs(balanceQuery);

        if (!querySnapshot.empty) {
            const balanceData = querySnapshot.docs[0].data();
            return {
                pointsBalance: balanceData.points_balance || 0,
                creditsBalance: balanceData.credit_balance || 0
            };
        } else {
            console.error("Balance record not found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user balance:", error);
        return null;
    }
};

export const fetchRecentSystemMessages = async (): Promise<PastMessageData[]> => {
    return fetchUserMessages(true, "System");
}

/** Helper to fetch all user messages */
export const fetchUserMessages = async (limitCount: boolean, sender?: string): Promise<UserMessage[]> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return [];
    }

    try {
        const userMessagesRef = collection(db, "messages");
        let messagesQuery = query(
            userMessagesRef,
            where("recipient", "==", user.uid),
            orderBy("received", "desc"),
        );

        if (sender) {
            messagesQuery = query(messagesQuery, where("sender", "==", sender));
        }

        if (limitCount == true) {
            messagesQuery = query(messagesQuery, limit(5));
        }

        const querySnapshot = await getDocs(messagesQuery);
        return querySnapshot.docs.map(doc => doc.data() as UserMessage);
    } catch (error) {
        console.error("Error fetching user messages:", error);
        return [];
    }
};

/** Fetch recent charging sessions */
export const fetchPastChargingSessions = async (): Promise<PastSessionData[]> => {
    const limitCount = 5;
    return fetchChargingSessions("complete", limitCount);
};

/** Fetch upcoming charging sessions */
export const fetchUpcomingChargingSessions = async (): Promise<UpcomingSessionData[]> => {
    return fetchChargingSessions("waiting");
};

/** Helper to fetch charging sessions based on status */
export const fetchChargingSessions = async (status: string, limitCount?: any): Promise<any[]> => {
    const user = auth.currentUser;
    if (!user) {
        console.warn("No user is currently logged in.");
        return [];
    }

    try {
        const sessionsRef = collection(db, "sessions");
        const sessionsQuery = query(
            sessionsRef,
            where("userID", "==", user.uid),
            where("status", "==", status),
            orderBy("bookedAt", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(sessionsQuery);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error(`Error fetching ${status} charging sessions:`, error);
        return [];
    }
};

/** Fetch user chargers from Firestore */
export const fetchUserChargers = async (): Promise<UserCharger[]> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return [];
    }

    try {
        const userChargersRef = collection(db, "charging_points");
        const chargersQuery = query(
            userChargersRef,
            where("userID", "==", user.uid),
            orderBy("id", "asc"),
        );

        const querySnapshot = await getDocs(chargersQuery);
        return querySnapshot.docs.map(doc => doc.data() as UserCharger);
    } catch (error) {
        console.error("Error fetching user messages:", error);
        return [];
    }
};

/** Fetch user transactions from Firestore */
export const fetchUserTransactions = async (): Promise<UserTransaction[]> => {
    const user = auth.currentUser;
    if (!user) {
        console.error("No authenticated user found.");
        return [];
    }

    try {
        const userTransactionsRef = collection(db, "transactions");
        const transactionsQuery = query(
            userTransactionsRef,
            where("userID", "==", user.uid),
            orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(transactionsQuery);
        return querySnapshot.docs.map(doc => doc.data() as UserTransaction);
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return [];
    }
};