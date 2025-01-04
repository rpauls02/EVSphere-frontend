import axios from 'axios';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type Role = 'buyer' | 'seller';
type PopupFunction = (message: string, type: 'success' | 'error') => void;

export const handleSignup = async (
    event: React.FormEvent,
    role: Role,
    firstName: string,
    lastName: string,
    email: string,
    countryCode: string,
    mobile: string,
    password: string,
    confirmPassword: string,
    companyName: string,
    setPopup: PopupFunction,
    resetForm: () => void
): Promise<void> => {
    event.preventDefault();
    const mobileNumber = `${countryCode}${mobile}`;

    if (password !== confirmPassword) {
        setPopup("Passwords do not match.", "error");
        return;
    }

    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId: string = userCredential.user.uid;

        // Create a Stripe customer
        const response = await axios.post('/StripeCustomers/createCustomer', {
            name: `${firstName} ${lastName}`,
            email,
        });

        const stripeCustomerId: string = response.data.id;

        // Save the Stripe customer ID to Firestore
        const stripeCustomerRef = doc(db, 'stripeCustomers', userId);
        await setDoc(stripeCustomerRef, { stripeCustomerId, userId });

        // Save user details in Firestore
        const userDocData: {
            role: Role;
            firstName: string;
            lastName: string;
            email: string;
            mobile: string;
            stripeCustomerId: string;
            companyName?: string;
        } = {
            role,
            firstName,
            lastName,
            email,
            mobile: mobileNumber,
            stripeCustomerId,
        };

        if (role === 'seller') {
            userDocData.companyName = companyName;
        }

        await setDoc(doc(db, 'users', userId), userDocData);

        setPopup("Signup successful. Verification email sent.", "success");
        resetForm();
    } catch (error: any) {
        console.error("Error signing up:", error);
        const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
        setPopup(`Error: ${errorMessage}`, "error");
    }
};
