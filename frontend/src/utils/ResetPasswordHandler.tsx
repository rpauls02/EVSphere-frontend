import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export const handleResetPassword = async (
  email: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const auth = getAuth();

  try {
    await sendPasswordResetEmail(auth, email);
    setSuccessMessage('Password reset link sent to your email!');
    setErrorMessage('');
  } catch (error) {
    setErrorMessage('Failed to send reset link. Please try again.');
    setSuccessMessage('');
    console.error('Reset password error:', error);
  }
};
