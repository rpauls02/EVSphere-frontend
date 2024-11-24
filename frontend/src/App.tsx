import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <main className="content">
                    <AppRoutes />
                </main>
            </div>
        </Router>
    );
};

export default App;