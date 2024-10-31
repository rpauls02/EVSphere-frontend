import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import Header from './components/BaseComponents/Header';
import AppRoutes from './AppRoutes'
import Footer from './components/BaseComponents/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="content">
          <AppRoutes/>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
