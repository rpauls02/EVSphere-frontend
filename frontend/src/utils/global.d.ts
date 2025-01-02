declare global {
  interface Window {
    recaptchaVerifier: import('firebase/auth').RecaptchaVerifier;
    confirmationResult: import('firebase/auth').ConfirmationResult;
  }
}

export {}; // Ensures this file is treated as a module
