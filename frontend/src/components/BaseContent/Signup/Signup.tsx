import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const handleTypeSelection = (userRole) => {
    if (userRole === 'buyer') {
      navigate('/buyersignup');
    } else if (userRole === 'seller') {
      navigate('/sellersignup');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h5>Are you signing up as a Buyer or Seller?</h5>
        <div className="user-type-selection">
          <button
            className="user-type-selection-button"
            onClick={() => handleTypeSelection('buyer')}
          >
            Buyer
          </button>
          <button
            className="user-type-selection-button"
            onClick={() => handleTypeSelection('seller')}
          >
            Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
