import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../BaseContent/Header';
import Home from '../BaseContent/Home';
import SellerNavbar from './SellerNavbar';
import Stations from './Stations'
import Analytics from './Analytics';
import NotFound from '../BaseContent/NotFound';
import Footer from '../BaseContent/Footer';
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
