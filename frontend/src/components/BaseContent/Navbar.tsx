import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="nav-options">
      <ul>
        <li><a href="">Tab 1</a></li>
        <li><a href="">Tab 2</a></li>
        <li><a href="">Tab 3</a></li>
        <li><a href="">Tab 4</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
