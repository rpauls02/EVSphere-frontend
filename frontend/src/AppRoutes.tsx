import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/BaseComponents/Login/Login';
import SignupForm from './components/BaseComponents/Signup/Signup';
import ResetPasswordForm from './components/BaseComponents/User/ResetPassword'
import NotFound from './components/BaseComponents/NotFound';
import Help from './components/BaseComponents/User/Help';
import Messages from './components/BaseComponents/User/Messages';
import Settings from './components/BaseComponents/User/Settings';
import BuyerDashboard from './components/BuyerContent/BuyerDashboard';
import Sessions from './components/BuyerContent/Sessions'
import HostServices from './components/BuyerContent/HostServices';
import Reports from './components/BuyerContent/Reports';
import Invoices from './components/BuyerContent/Invoices';
import SellerDashboard from './components/SellerContent/SellerDashboard';
import Stations from './components/SellerContent/Stations';
import GetAllCustomers from './StripePages/getAllCustomers';
import AddCustomerForm from './StripePages/createCustomer';
import GetCustomerById from './StripePages/getCustomerByID';
import PaymentPage from './StripePages/checkoutForm';
import CancelPage from './StripePages/cancel';
import SuccessPage from './StripePages/success';
import CheckoutButton from './StripePages/checkoutForm';
import CheckoutPage from './StripePages/checkoutForm';


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
      {/*<Route path="/help" element={<Help />} />*/}
      <Route path="/settings" element={<Settings />} />

      {/*Buyer pages routing*/}
      <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/host-services" element={<HostServices />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/invoices" element={<Invoices />} />

      {/*Seller pages routing*/}
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/stations" element={<Stations />} />

      {/*Stripe pages routing*/}
      <Route path="/get-customers" element={<GetAllCustomers />} />
      <Route path ="/add-customer" element={<AddCustomerForm />} />
      <Route path="/get-customer/:id" element={<GetCustomerById />} />
      <Route path='/checkout' element={<CheckoutPage />} />
      <Route path='/cancel' element={<CancelPage />} />
      <Route path='/success' element={<SuccessPage />} />
    </Routes>
  );
}

export default AppRoutes;
