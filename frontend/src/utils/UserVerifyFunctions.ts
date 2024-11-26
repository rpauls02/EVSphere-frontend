import { getAuth, RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Request OTP for phone verification
export const requestPhoneVerification = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult | null> => {
  try {
    // Ensure reCAPTCHA is rendered and ready
    await recaptchaVerifier.render();
    console.log('reCAPTCHA rendered successfully');

    // Request OTP for phone verification
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('OTP sent successfully to', phoneNumber);
    return confirmationResult;
  } catch (error: unknown) {
    // Type assertion to Error
    if (error instanceof Error) {
      console.error('Error sending OTP:', error.message);
    } else {
      console.error('An unknown error occurred during OTP sending');
    }
    return null;
  }
};

// Verify OTP entered by the user
export const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string): Promise<void> => {
  try {
    // Confirm the OTP entered by the user
    await confirmationResult.confirm(otp);
    console.log('2FA setup successful!');
  } catch (error: unknown) {
    // Type assertion to Error
    if (error instanceof Error) {
      console.error('Error confirming OTP:', error.message);
    } else {
      console.error('An unknown error occurred during OTP confirmation');
    }
  }
};
