import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/BaseComponents/Login/Login';
import SignupForm from './components/BaseComponents/Signup/Signup';
import ResetPasswordForm from './components/BaseComponents/User/ResetPassword'
import NotFound from './components/BaseComponents/NotFound';
import Help from './components/BaseComponents/User/Help';
import Balance from './components/BuyerContent/Balance';
import Messages from './components/BaseComponents/User/Messages';
import Settings from './components/BaseComponents/User/Settings';
import BuyerDashboard from './components/BuyerContent/BuyerDashboard';
import Sessions from './components/BuyerContent/Sessions'
import HostServices from './components/BuyerContent/HostServices';
import SellerDashboard from './components/SellerContent/SellerDashboard';
import Stations from './components/SellerContent/Stations';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/*Entry page*/}
      <Route path="/" element={<LoginForm />} />

      {/*Base pages routing*/}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="*" element={<NotFound />} />

      {/*User pages routing */}
      <Route path="/messages" element={<Messages />} />
      <Route path="/help" element={<Help />} />
      <Route path="/settings" element={<Settings />} />

      {/*Buyer pages routing*/}
      <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/host-services" element={<HostServices />} />
      <Route path="/balances" element={<Balance />} />

      {/*Seller pages routing*/}
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/stations" element={<Stations />} />
    </Routes>
  );
}

export default AppRoutes;
