import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const handleSignup = async (
    event: React.FormEvent,
    role: string,
    firstName: string,
    lastName: string,
    email: string,
    countryCode: string,
    mobile: string,
    password: string,
    companyName: string,
    setPopup: (message: string, type: 'success' | 'error') => void
) => {
    event.preventDefault();
    const mobileNumber = `${countryCode}${mobile}`;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userDocId = `${role}_${firstName.charAt(0).toLowerCase()}${lastName.slice(0, 5).toLowerCase()}${mobile.slice(-4)}`;

        const userDocData: any = {};

        if (role === 'seller') {
            userDocData.companyName = companyName;
        }
        
        userDocData.role = role;
        userDocData.firstName = firstName;
        userDocData.lastName = lastName;
        userDocData.email = email;
        userDocData.mobile = mobileNumber;

        await setDoc(doc(db, 'users', userDocId), userDocData);

        setPopup("Successfully signed up. Please log in.", "success");

    } catch (error) {
        const errorMessage = (error as Error).message || "An unknown error occurred.";
        console.error("Error signing up:", error);
        setPopup(`Error: ${errorMessage}`, "error");
    }
};
