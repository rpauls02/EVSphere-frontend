import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { handleResetPassword } from '../../../utils/UserDetailsFunctions';
import './ResetPassword.css';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmission = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleResetPassword(email, setErrorMessage, setSuccessMessage);
    setEmail('');
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Your Password</h2>
        <p>
          Enter your email address below to receive a password reset link.
        </p>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <form onSubmit={handleSubmission}>
          <div className="form-group">
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="reset-button" type="submit">Send Reset Link</button>
        </form>
        <p className="back-to-login">
          Remembered your password? <Link className="react-link" to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
