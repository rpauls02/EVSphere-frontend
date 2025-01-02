import { sendEmailVerification } from 'firebase/auth';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const handleResendVerification = async () => {
    try {
      await sendEmailVerification();
      alert('Verification email sent successfully. Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Failed to send verification email. Please try again later.');
    }
  };

  return (
    <div className="verify-email-notification">
      <p>Your email is not verified.</p>
      <button className="resend-email-button" onClick={handleResendVerification}>
        Resend
      </button>
    </div>
  );
};

export default VerifyEmail;
