import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const handleSignup = async (
    event: React.FormEvent,
    firstName: string,
    lastName: string,
    email: string,
    phoneCode: string,
    mobile: string,
    password: string,
) => {
    event.preventDefault();
    const mobileNumber = `${phoneCode}${mobile}`;

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user
        const userId = user.uid;

        // Prepare user document data
        const userDocData: any = {
            userName: `${firstName.charAt(0).toLowerCase()}${lastName.slice(0, 5).toLowerCase()}${mobile.slice(-4)}`,
            firstName,
            lastName,
            email,
            mobile: mobileNumber,
        };

        // Set user document in 'users' collection
        await setDoc(doc(db, 'users', userId), userDocData);

        // Set user balance to 0 in 'balances' collection
        const userBalanceData: any = {
            userID: user.uid,
            points_balance: 0,
            credit_balance: 0
        };
        await setDoc(doc(db, 'balances'), userBalanceData);

        // Send verification email
        await sendEmailVerification(user);

    } catch (error) {
        const errorMessage = (error as Error).message || "An unknown error occurred.";
        console.error("Error signing up:", error);
    }
};