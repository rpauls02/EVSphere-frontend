import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmission = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.type === 'buyer') {
          alert('Login successful!');
          navigate('/buyer-dashboard');
        } else if (userData.type === 'seller') {
          alert('Login successful!');
          navigate('/seller-dashboard');
        } else if (userData.type === 'both') {
          alert('Login successful!');
          navigate('/user-dashboard');
        }
      }
    } catch (error) {
      setErrorMessage('Incorrect details entered.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign in with your details</h2>
        <p className="new-user-option">
          New to EVSphere? <Link className="react-link" to="/signup">Create an account</Link>
        </p>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

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
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group forgot-password">
            <p><Link to="/reset-password">Forgot password?</Link></p>
          </div>
          <div className="form-group remember-me">
            <label htmlFor="remember">Remember me</label>
            <input type="checkbox" id="remember" />
          </div>
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
