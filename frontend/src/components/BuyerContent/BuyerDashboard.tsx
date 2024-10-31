import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../BaseComponents/Header';
import Home from '../BaseComponents/Home';
import BuyerNavbar from './BuyerNavbar';
import Vehicles from './Vehicles'
import Chargers from './Chargers';
import Reports from './Reports';
import Invoices from './Invoices';
import NotFound from '../BaseComponents/NotFound';
import Footer from '../BaseComponents/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <BuyerNavbar/>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/chargers" element={<Chargers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
