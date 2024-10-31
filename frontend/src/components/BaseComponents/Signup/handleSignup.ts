// handleSignup.ts
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const handleSignup = async (
    event: React.FormEvent,
    userRole: string,
    firstName: string,
    lastName: string,
    email: string,
    countryCode: string,
    mobile: string,
    password: string,
    companyName: string
) => {
    event.preventDefault();
    const mobileNumber = `${countryCode}${mobile}`;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userDocId = `${userRole}_${firstName.charAt(0).toLowerCase()}${lastName.slice(0, 5).toLowerCase()}${mobile.slice(0, 3)}`;

        const userDocData: any = {};

        if (userRole === 'seller') {
            userDocData.companyName = companyName;
        }
        
        userDocData.userRole = userRole;
        userDocData.firstName = firstName;
        userDocData.lastName = lastName;
        userDocData.email = email;
        userDocData.mobile = mobileNumber;

        await setDoc(doc(db, 'users', userDocId), userDocData);

        console.log("User created and data saved to Firestore");
        alert("Signup successful!");
    } catch (error) {
        const errorMessage = (error as Error).message || "An unknown error occurred.";
        console.error("Error signing up:", error);
        alert(`Error: ${errorMessage}`);
    }
};
