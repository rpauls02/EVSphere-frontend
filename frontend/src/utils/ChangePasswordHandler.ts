import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

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