import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { AccountCircle } from '@mui/icons-material';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../../firebaseConfig';
import logo from '../../assets/logo-name.png';
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
  };

  return (
    <header>
      <nav className="nav-main">
        <div className="nav-main-logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="nav-main-util">
          <div className="nav-main-util-login">
            <Link to={user ? "/profile" : "/login"} onClick={toggleDropdown} style={{ display: 'flex', alignItems: 'center' }}>
              <AccountCircle style={{ fontSize: '32px', color: "black" }} />
              <p>{user ? `${user.firstName}` : 'Sign in'}</p>
            </Link>
            {user && dropdownOpen && (
              <div className="dropdown">
                <ul className="dropdown-menu">
                  <li onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>Profile</li>
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
