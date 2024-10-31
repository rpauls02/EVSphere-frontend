import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/BaseContent/Home';
import Login from './components/BaseContent/Login';
import Signup from './components/BaseContent/Signup/Signup';
import NotFound from './components/BaseContent/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
