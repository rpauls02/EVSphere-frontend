import { signInWithEmailAndPassword, signInWithPhoneNumber, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

export const handleLogin = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string; role?: string }> => {

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { success: true, message: 'Login successful', role: userData.role };
    }

    return { success: false, message: 'User data not found' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed. Please check the credentials you\'ve entered.' };
  }
};

export const handleGoogleAuth = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const user = auth.currentUser;

    if (user) {
      const provider = new GoogleAuthProvider();
      await linkWithPopup(user, provider);

      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { success: true, message: 'Google account linked successfully.' };
      }

      return { success: false, message: 'User data not found after linking.' };
    } else {
      return { success: false, message: 'No authenticated user found.' };
    }
  } catch (error) {
    console.error('Google authentication error:', error);
    return { success: false, message: 'Failed to link Google account. Please try again.' };
  }
};

