import { auth, db } from '../../../firebaseConfig'; // Adjust the import path accordingly
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const onSignup = async (userData) => {
    const { companyName, firstName, lastName, email, password, mobile } = userData;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            companyName,
            firstName,
            lastName,
            email,
            mobile,
        });

        console.log("User created and data saved to Firestore");
        return user;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export default onSignup;
