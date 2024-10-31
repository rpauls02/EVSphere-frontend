import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/BaseComponents/Home';
import LoginForm from './components/BaseComponents/Login/LoginForm';
import SignupForm from './components/BaseComponents/Signup/SignupForm';
import NotFound from './components/BaseComponents/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/*Base pages routing*/}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="*" element={<NotFound />} />
      {/*<Route path="/user-dashboard" element={<UserDashboard />}*/}

      {/*Buyer pages routing*/}
      {/*<Route path="/buyer-dashboard" element={<BuyerDashboard />}*/}
      {/*<Route path="/vehicles" element={<Vehicles />}*/}
      {/*<Route path="/chargers" element={<Chargers />}*/}
      {/*<Route path="/reports" element={<Reports />}*/}
      {/*<Route path="/invoices" element={<Invoices />}*/}

      {/*Seller pages routing*/}
      {/*<Route path="/seller-dashboard" element={<SellerDashboard />}*/}
      {/*<Route path="/stations" element={<Stations />}*/}
    </Routes>
  );
}

export default AppRoutes;
