import { auth } from '../firebaseConfig';
import firebase from 'firebase/app';

export const requestPhoneVerification = async (phoneNumber: string, recaptchaVerifier: firebase.auth.RecaptchaVerifier): Promise<firebase.auth.ConfirmationResult | null> => {
  try {
    // Render reCAPTCHA
    await recaptchaVerifier.render();

    // Request OTP for phone verification
    const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return null;
  }
};

export const verifyOtp = async (confirmationResult: firebase.auth.ConfirmationResult, otp: string): Promise<void> => {
  try {
    // Confirm the OTP entered by the user
    await confirmationResult.confirm(otp);
    console.log('2FA setup successful!');
  } catch (error) {
    console.error('Error confirming OTP:', error.message);
  }
};
