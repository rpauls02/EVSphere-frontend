import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChargingStationList = () => {
  const [chargingPointId, setChargingPointId] = useState('');
  const navigate = useNavigate();

  const handleConnect = () => {
    console.log(`Connecting to charging point: ${chargingPointId}`);
    navigate('/session');
  };

  return (
    <div>
      <h2>Charging Stations</h2>
      <label htmlFor="chargingPointId">Enter Charging Point ID:</label>
      <input
        type="text"
        id="chargingPointId"
        value={chargingPointId}
        onChange={(e) => setChargingPointId(e.target.value)}
      />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default ChargingStationList;
