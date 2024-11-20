import { getAuth, updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const handleEmailChange = async (
    currentEmail: string,
    newEmail: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onClose: () => void
) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && newEmail !== currentEmail) {
        try {
            setLoading(true);
            await updateEmail(user, newEmail);

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                email: newEmail
            });

            onClose();
        } catch (error) {
            setError('Failed to update email. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    } else {
        setError('Please enter a valid email address.');
    }
};
