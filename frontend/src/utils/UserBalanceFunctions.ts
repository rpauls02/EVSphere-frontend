import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export const updateUserBalance = async (newCreditBalance: number): Promise<boolean> => {
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


