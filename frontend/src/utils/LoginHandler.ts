import { signInWithEmailAndPassword, signInWithPhoneNumber, GoogleAuthProvider, linkWithPopup, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export const handleLogin = async (
  identifier: string,
  password?: string
): Promise<{ success: boolean; message: string; role?: string }> => {
  try {

    // Check if the identifier is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (isEmail) {
      // Email-based login
      if (!password) {
        return { success: false, message: 'Password is required for email login.' };
      }

      const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { success: true, message: 'Login successful', role: userData.role };
      }

      return { success: false, message: 'User data not found.' };
    } else {
      // Phone-based login
      const phoneNumber = identifier;

      // Ensure the client-side setup for reCAPTCHA
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" },
        );
      }

      try {
        // Trigger OTP
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);

        // Store `confirmationResult` for OTP verification
        window.confirmationResult = confirmationResult;

        return { success: true, message: 'OTP sent. Please verify.' };
      } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: 'Failed to send OTP. Please check the phone number.' };
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed. Please check the credentials you\'ve entered.' };
  }
};


export const handleGoogleAuth = async (): Promise<{ success: boolean; message: string, role?: string }> => {
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

