import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import {deleteUser} from 'firebase/auth';

export const handleDeleteAccount = (
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: () => void
) => {
    const user = auth.currentUser;
    if (!user) {
        setError("No user is currently logged in.");
        return;
    }

    setLoading(true);
    const userDocRef = doc(db, "users", user.uid);

    deleteDoc(userDocRef)
        .then(() => {
            return deleteUser(user);
        })
        .then(() => {
            setLoading(false);
            onSuccess();
        })
        .catch((error) => {
            setLoading(false);
            if (error.code === 'auth/requires-recent-login') {
                setError("Please log in again to delete your account.");
            } else {
                setError("An error occurred while deleting your account. Please try again.");
            }
        });
};
