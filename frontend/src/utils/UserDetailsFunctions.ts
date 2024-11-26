import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { deleteUser } from 'firebase/auth';

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

export const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onClose: () => void
) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
    }

    if (newPassword === currentPassword) {
        setError("New password cannot be the same as the current password.");
        setLoading(false);
        return;
    }

    if (user && newPassword === confirmPassword) {
        try {
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, newPassword);
            onClose();
        } catch (error) {
            setError("Failed to update password. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    } else {
        setError("User is not authenticated.");
        setLoading(false);
    }
};

export const handleResetPassword = async (
    email: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
) => {
    const auth = getAuth();

    try {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('If this email exists, an email will be sent. If you cannot find the email, check your junk folder.');
        setErrorMessage('');
    } catch (error) {
        setErrorMessage('Failed to send reset link. Please try again.');
        setSuccessMessage('');
        console.error('Reset password error:', error);
    }
};

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