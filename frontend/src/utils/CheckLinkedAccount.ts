import { getAuth, fetchSignInMethodsForEmail, GoogleAuthProvider } from 'firebase/auth';

const checkIfGoogleLinked = async (): Promise<boolean> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user && user.email) {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, user.email);
      return methods.includes(GoogleAuthProvider.PROVIDER_ID);
    } catch (error) {
      console.error('Error fetching sign-in methods:', error);
      return false;
    }
  } else {
    console.error('User is not authenticated or email is not available');
    return false;
  }
};