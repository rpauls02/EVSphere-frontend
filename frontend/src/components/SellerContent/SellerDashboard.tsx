import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../BaseComponents/Header';
import Home from '../BaseComponents/Home';
import SellerNavbar from './SellerNavbar';
import Stations from './Stations'
import Analytics from './Analytics';
import NotFound from '../BaseComponents/NotFound';
import Footer from '../BaseComponents/Footer';
import './SellerDashboard.css';

const SellerDashboard: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <SellerNavbar/>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Stations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default SellerDashboard;
