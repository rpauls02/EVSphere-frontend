import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Vehicles.css';

const Vehicles: React.FC = () => {
    return (
        <div className="section">
            <h2>Manage Linked Vehicles</h2>
            {/* Add buttons or forms to add/remove vehicles */}
            <button>Add New Vehicle</button>
            <button>Remove Vehicle</button>
            {/* Display linked vehicles here */}
        </div>
    );
}

export default Vehicles;