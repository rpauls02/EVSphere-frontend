import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const handleSignup = async (
    event: React.FormEvent,
    role: 'buyer' | 'seller',
    firstName: string,
    lastName: string,
    email: string,
    countryCode: string,
    mobile: string,
    password: string,
    confirmPassword: string,
    companyName: string,
    setPopup: (message: string, type: 'success' | 'error') => void,
    resetForm: () => void
) => {
    event.preventDefault();
    const mobileNumber = `${countryCode}${mobile}`;

    if (password !== confirmPassword) {
        setPopup("Passwords do not match.", "error");
        return;
    }

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Prepare user document data
        const userDocData: any = {
            role,
            userName: `${firstName.charAt(0).toLowerCase()}${lastName.slice(0, 5).toLowerCase()}${mobile.slice(-4)}`,
            firstName,
            lastName,
            email,
            mobile: mobileNumber,
        };

        if (role === 'seller') {
            userDocData.companyName = companyName;
        }

        // Set user document in 'users' collection
        await setDoc(doc(db, 'users', userId), userDocData);

        // Set user balance to 0 in 'balances' collection
        const userBalanceData = {
            userID: userId,
            points_balance: 0,
            credit_balance: 0
        };
        await setDoc(doc(db, 'balances'), userBalanceData);

        resetForm();

    } catch (error) {
        const errorMessage = (error as Error).message || "An unknown error occurred.";
        console.error("Error signing up:", error);
        setPopup(`Error: ${errorMessage}`, "error");
    }
};

