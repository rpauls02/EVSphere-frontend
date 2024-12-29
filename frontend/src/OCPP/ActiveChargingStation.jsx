import React, { useState, useEffect } from 'react';

const ActiveChargingSession = () => {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9000');

    ws.onopen = () => {
      console.log('Connected to OCPP server');
      setStatus('Connected to OCPP server');
      
      // Send a Heartbeat request
      ws.send(JSON.stringify({ id: 'Heartbeat' }));
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('Server response:', response);
      setStatus(`Server response: ${response.status}`);
    };

    ws.onclose = () => {
      console.log('Disconnected from OCPP server');
      setStatus('Disconnected from OCPP server');
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Active Charging Session</h2>
      <p>Status: {status}</p>
    </div>
  );
};

export default ActiveChargingSession;
