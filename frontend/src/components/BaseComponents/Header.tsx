import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './Header.css';
import { IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../../firebaseConfig';
import logo from '../../assets/logo-name.png';

interface User {
  fname: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              fname: userData.fname
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
            <Link to={user ? "/profile" : "/login"}>
              <IconButton>
                <AccountCircle style={{ fontSize: '32px', color: "black" }} />
              </IconButton>
              <p>{user ? `${user.fname}` : 'Sign in'}</p>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
