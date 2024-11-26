import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { AccountCircle } from '@mui/icons-material';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../../firebaseConfig';
import logo from '../../assets/logo.png';
import LogoutHandler from '../../utils/LogoutHandler';

interface User {
  firstName: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              firstName: userData.firstName,
            });
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await LogoutHandler();
    navigate('/');
  };

  return (
    <header>
      <nav className="header-main">
        <div className="header-main-logo">
          <Link to="/">
            <img src={logo} alt="evsphere-logo" />
          </Link>
        </div>
        <div className="header-util">
          <div className="header-util-login">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <AccountCircle
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    navigate("/login");
                  } else {
                    toggleDropdown();
                  }
                }}
                style={{ fontSize: '32px', color: "white" }}
              />
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    navigate("/login");
                  }
                }}
                style={{ margin: '0', marginLeft: '8px', color: 'white' }}
              >
                {user ? `${user.firstName}` : 'Sign in'}
              </p>
            </div>
            {user && dropdownOpen && (
              <div className="dropdown">
                <ul className="dropdown-menu">
                  <li onClick={() => { navigate("/user-dashboard"); setDropdownOpen(false); }}>Home</li>
                  <li onClick={() => { navigate("/messages"); setDropdownOpen(false); }}>Messages</li>
                  <li onClick={() => { navigate("/settings"); setDropdownOpen(false); }}>Settings</li>
                  <li onClick={() => { handleLogout(); setDropdownOpen(false); }}>Log out</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
