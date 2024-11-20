import { getAuth, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';

export const LinkGoogleAccountHandler = async (
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onClose: () => void
) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            setLoading(true);

            // Create a Google Auth provider
            const provider = new GoogleAuthProvider();

            // Link the user's Google account to the existing email account
            await linkWithPopup(user, provider);

            // Successfully linked, now you can perform additional logic
            console.log('Google account linked successfully!');

            onClose();
        } catch (error) {
            setError('Failed to link Google account. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    } else {
        setError('No authenticated user found.');
    }
};
