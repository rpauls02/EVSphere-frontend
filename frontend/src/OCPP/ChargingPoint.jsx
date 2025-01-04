import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

const ActiveChargingSession = () => {
  const { chargerId } = useParams();
  const [chargerData, setChargerData] = useState(null);
  const [chargingProgress, setChargingProgress] = useState(0); // % Charged
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const chargerRef = ref(db, `hostedChargers/${chargerId}`);

    // Fetch charger details
    onValue(chargerRef, (snapshot) => {
      setChargerData(snapshot.val());
    });
  }, [chargerId]);

  const handleStartCharging = () => {
    // Example: Connect to the OCPP server and start charging
    setIsCharging(true);

    // Simulate charging progress (replace with OCPP WebSocket logic)
    const interval = setInterval(() => {
      setChargingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCharging(false);
          return 100;
        }
        return prev + 10; // Increment by 10% every second
      });
    }, 1000);
  };

  if (!chargerData) {
    return <p>Loading charger data...</p>;
  }

  return (
    <div>
      <h1>Charging Point: {chargerId}</h1>
      <p><strong>Address:</strong> {chargerData.address}</p>
      <p><strong>Connector Type:</strong> {chargerData.connectorTypes}</p>
      <p><strong>Current Users:</strong> {chargerData.currentUsers}</p>
      <p><strong>Status:</strong> {chargerData.isAvailable ? "Available" : "Occupied"}</p>

      <button onClick={handleStartCharging} disabled={isCharging || chargingProgress >= 100}>
        {isCharging ? "Charging..." : "Start Charging"}
      </button>

      <div>
        <p><strong>Charging Progress:</strong> {chargingProgress}%</p>
      </div>

      <div>
        <a href="/path/to/predefined/csv/file.csv" download>
          Download Charging Report
        </a>
      </div>
    </div>
  );
};

export default ActiveChargingSession;