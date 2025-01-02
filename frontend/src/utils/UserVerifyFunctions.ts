import { RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber, getAuth } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const verifyEmail = () => {
  const user = auth.currentUser;
  return user && !user.emailVerified;
};

export const requestPhoneVerification = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult | null> => {
  try {
    await recaptchaVerifier.render();
    console.log('reCAPTCHA rendered successfully');

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('OTP sent successfully to', phoneNumber);
    return confirmationResult;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error sending OTP:', error.message);
    } else {
      console.error('An unknown error occurred during OTP sending');
    }
    return null;
  }
};

export const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string): Promise<void> => {
  try {
    await confirmationResult.confirm(otp);
    console.log('2FA setup successful!');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error confirming OTP:', error.message);
    } else {
      console.error('An unknown error occurred during OTP confirmation');
    }
  }
};
