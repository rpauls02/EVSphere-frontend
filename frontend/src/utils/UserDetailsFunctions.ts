import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { deleteUser } from 'firebase/auth';

export const handleUpdateEmail = async (
    currentEmail: string,
    newEmail: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onClose: () => void
) => {
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

export const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onClose: () => void
) => {
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
    try {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('If this email exists, an email will be sent. Check your junk folder.');
        setErrorMessage('');
    } catch (error) {
        setErrorMessage('Failed to send reset link. Please try again.');
        setSuccessMessage('');
        console.error('Reset password error:', error);
    }
};

export const handleUpdateCredits = async (
    newCreditBalance: number,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onClose: () => void
) => {
    const user = auth.currentUser;

    if (user) {
        try {
            setLoading(true);
            const balanceRef = doc(db, 'balance', user.uid);
            await updateDoc(balanceRef, {
                credits_balance: newCreditBalance
            });

            onClose();
        } catch (error) {
            setError('Failed to update credit balance. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    } else {
        setError('User not authenticated. Please log in and try again.');
    }
};

export const handleAddChargers = async (
    address: string,
    addressAccess: string,
    chargerCount: number,
    chargerTypes: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: () => void
) => {
    const user = auth.currentUser;

    if (user) {
        try {
            setLoading(true);

            const chargersPromises = Array.from({ length: chargerCount }, (_, index) => {
                const chargerData = {
                    userID: user.uid,
                    address,
                    addressAccess,
                    charger_id: `charger_00${index + 1}`,
                    type: chargerTypes.split(',')[index % chargerTypes.split(',').length],
                    status: 'available',
                };

                return setDoc(doc(db, 'charging_points', `charger_${index + 1}`), chargerData);
            });

            await Promise.all(chargersPromises);

            onSuccess();
        } catch (error) {
            setError('Failed to add charging points. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    } else {
        setError('User not authenticated. Please log in and try again.');
    }
};

export const handleDeleteAccount = async (
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