import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ActiveChargingSession = () => {
  const { chargerId } = useParams(); // Get chargerId from the route
  const [status, setStatus] = useState('Waiting to start...');
  const [chargingPercentage, setChargingPercentage] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  // Variables to track during charging
  const [pricePerKWh] = useState(0.45); // £0.45 per kWh
  const [kWhSoFar, setKWhSoFar] = useState(0);
  const [currentKW, setCurrentKW] = useState(0);
  const [timeSoFar, setTimeSoFar] = useState(0); // Seconds
  const [costSoFar, setCostSoFar] = useState(0);

  const startCharging = () => {
    setStatus('Initializing...');
    const ws = new WebSocket('ws://localhost:9000');

    ws.onopen = () => {
      console.log('Connected to OCPP server');
      setStatus('Connected to OCPP server');

      // Send a StartTransaction message
      ws.send(
        JSON.stringify({
          id: 'StartTransaction',
          connectorId: chargerId,
          meterStart: 0,
          timestamp: new Date().toISOString(),
        })
      );
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('Server response:', response);

      if (response.id === 'StartTransaction' && response.status === 'Accepted') {
        setStatus('Charging session started');
        setSessionActive(true);

        // Simulate charging progress
        const interval = setInterval(() => {
          setChargingPercentage((prev) => {
            if (prev >= 100) {
              clearInterval(interval);

              // Send StopTransaction when charging is complete
              ws.send(
                JSON.stringify({
                  id: 'StopTransaction',
                  connectorId: chargerId,
                  meterStop: kWhSoFar,
                  timestamp: new Date().toISOString(),
                })
              );
              setStatus('Charging session completed');
              setSessionActive(false);
              return 100;
            }

            // Update session variables
            const newKW = Math.random() * 7 + 3; // Simulate 3-10 kW draw
            const timeIncrement = 1; // 1 second interval
            const energyIncrement = newKW * (timeIncrement / 3600); // kWh in 1 second

            setCurrentKW(newKW.toFixed(2));
            setKWhSoFar((prevKWh) => prevKWh + energyIncrement);
            setTimeSoFar((prevTime) => prevTime + timeIncrement);
            setCostSoFar((prevCost) => prevCost + energyIncrement * pricePerKWh);

            return prev + 1;
          });
        }, 1000); // Update every second
      } else if (response.id === 'StopTransaction' && response.status === 'Accepted') {
        setStatus('Charging session terminated');
        ws.close();
      } else {
        setStatus(`Server response: ${response.status}`);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from OCPP server');
      setStatus('Disconnected from OCPP server');
    };

    return () => ws.close();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div>
      <h2>Active Charging Session</h2>
      <p><strong>Charger ID:</strong> {chargerId}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Charging Progress:</strong> {chargingPercentage}%</p>

      {!sessionActive && (
        <button onClick={startCharging}>Start Charging</button>
      )}

      {sessionActive && (
        <div>
          <p><strong>Price per kWh:</strong> £{pricePerKWh}</p>
          <p><strong>kWh So Far:</strong> {kWhSoFar.toFixed(2)} kWh</p>
          <p><strong>Current kW:</strong> {currentKW} kW</p>
          <p><strong>Time So Far:</strong> {formatTime(timeSoFar)}</p>
          <p><strong>£ So Far:</strong> £{costSoFar.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default ActiveChargingSession;
