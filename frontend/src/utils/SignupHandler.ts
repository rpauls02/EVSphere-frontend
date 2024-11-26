import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

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

        await setDoc(doc(db, 'users', userCredential.user.uid), userDocData);

        setPopup("Successfully signed up. Please log in.", "success");
        resetForm();

    } catch (error) {
        const errorMessage = (error as Error).message || "An unknown error occurred.";
        console.error("Error signing up:", error);
        setPopup(`Error: ${errorMessage}`, "error");
    }
};