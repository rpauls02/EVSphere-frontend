import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/BaseComponents/Home';
import LoginForm from './components/BaseComponents/Login/LoginForm';
import SignupForm from './components/BaseComponents/Signup/SignupForm';
import ResetPasswordForm from './components/BaseComponents/Login/ResetPasswordForm'
import NotFound from './components/BaseComponents/NotFound';
import UserDashboard from './components/BaseComponents/User/UserDashboard';
import BuyerDashboard from './components/BuyerContent/BuyerDashboard';
import Vehicles from './components/BuyerContent/Vehicles';
import Chargers from './components/BuyerContent/Chargers';
import Reports from './components/BuyerContent/Reports';
import Invoices from './components/BuyerContent/Invoices';
import SellerDashboard from './components/SellerContent/SellerDashboard';
import Stations from './components/SellerContent/Stations';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/*Base pages routing*/}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="*" element={<NotFound />} />

      {/*Profile pages routing */}
      <Route path="/user-dashboard" element={<UserDashboard />} />

      {/*Buyer pages routing*/}
      <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/chargers" element={<Chargers />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/invoices" element={<Invoices />} />

      {/*Seller pages routing*/}
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/stations" element={<Stations />} />
    </Routes>
  );
}

export default AppRoutes;
