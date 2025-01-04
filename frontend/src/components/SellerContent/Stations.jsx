import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import SellerSidebar from "./SellerSidebar";
import "./Stations.css";
import { useNavigate } from "react-router-dom";

const Stations = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentFname, setCurrentFname] = useState(""); // Added state for user's first name
  const [chargers, setChargers] = useState([]);

  const db = getDatabase();
  const navigate = useNavigate(); // Call useNavigate inside the component

  useEffect(() => {
    // Fetch current user from Firebase Authentication
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setCurrentUser(user);
      setCurrentFname(user.displayName || "User");
    }
  }, []);

  useEffect(() => {
    // Fetch chargers from Firebase Realtime Database
    const chargersRef = ref(db, "hostedChargers");

    onValue(chargersRef, (snapshot) => {
      const chargersData = snapshot.val();
      if (chargersData) {
        const chargersList = Object.keys(chargersData).map((key) => {
          const charger = chargersData[key];
          // Update `isAvailable` based on currentUsers and connectorCount
          charger.isAvailable = charger.currentUsers < charger.connectorCount;
          return { id: key, ...charger };
        });
        setChargers(chargersList);
      } else {
        setChargers([]);
      }
    });
  }, [db]);

  const handleOccupyCharger = (chargerId) => {
    const chargerRef = ref(db, `hostedChargers/${chargerId}`);
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("User must be signed in to occupy a charger.");
      return;
    }
  
    // Fetch the current charger data
    onValue(chargerRef, (snapshot) => {
      const charger = snapshot.val();
  
      if (charger && charger.currentUsers < charger.connectorCount) {
        // Prevent duplicate user IDs in the occupants array
        const updatedOccupants = charger.occupants
          ? charger.occupants.includes(user.uid)
            ? charger.occupants // If user is already occupying, don't add again
            : [...charger.occupants, user.uid] // Add the user if not already present
          : [user.uid]; // Initialize the occupants array if undefined
  
        // Update only one slot for the current user
        const updatedData = {
          currentUsers: charger.currentUsers + 1,
          isAvailable: charger.currentUsers + 1 < charger.connectorCount,
          occupants: updatedOccupants,
        };
  
        // Apply the update to the database
        update(chargerRef, updatedData)
          .then(() => {
            console.log(`Charger ${chargerId} occupied successfully.`);
            navigate(`/active-charging-stations/${chargerId}`); // Redirect to charging analytics page
          })
          .catch((error) => {
            console.error(`Failed to occupy charger ${chargerId}:`, error);
          });
      } else {
        console.error("Charger is not available or has reached maximum capacity.");
      }
    }, { onlyOnce: true }); // Ensures the listener only triggers once
  };
  
  const handleReleaseCharger = (chargerId) => {
    const chargerRef = ref(db, `hostedChargers/${chargerId}`);

    onValue(chargerRef, (snapshot) => {
      const charger = snapshot.val();

      if (charger && charger.currentUsers > 0) {
        // Decrement currentUsers and update isAvailable
        const updatedData = {
          currentUsers: charger.currentUsers - 1,
          isAvailable: charger.currentUsers - 1 < charger.connectorCount,
        };

        // Apply the update
        update(chargerRef, updatedData)
          .then(() => console.log(`Charger ${chargerId} released successfully.`))
          .catch((error) =>
            console.error(`Failed to release charger ${chargerId}:`, error)
          );
      }
    });
  };

  return (
    <div className="dashboard-container">
      <SellerSidebar />
      <div className="page-title-container">
        <h1>Welcome back, {currentFname}</h1>
      </div>
      <div className="seller-dashboard-content">
        <h2>Available Chargers</h2>
        <div className="chargers-list">
          {chargers.map((charger) => (
            <div
              key={charger.id}
              className={`charger-box ${
                charger.isAvailable ? "available" : "unavailable"
              }`}
            >
              <h3>Charger ID: {charger.id}</h3>
              <p>
                <strong>Address:</strong> {charger.address}
              </p>
              <p>
                <strong>Connector Type:</strong> {charger.connectorTypes}
              </p>
              <p>
                <strong>Max Users:</strong> {charger.connectorCount}
              </p>
              <p>
                <strong>Current Users:</strong> {charger.currentUsers}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {charger.isAvailable ? "Available" : "Not Available"}
              </p>
              <div className="charger-actions">
                <button
                  disabled={
                    !charger.isAvailable || charger.hostId === currentUser?.uid
                  }
                  onClick={() => handleOccupyCharger(charger.id)}
                >
                  Occupy
                </button>
                <button
                  disabled={charger.currentUsers === 0}
                  onClick={() => handleReleaseCharger(charger.id)}
                >
                  Release
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stations;
