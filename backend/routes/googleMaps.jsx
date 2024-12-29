import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // Set map container style
  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  // Default zoom level
  const defaultZoom = 12;

  // Fetch user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  // Fetch charging stations (mock API call)
  useEffect(() => {
    const fetchStations = async () => {
      const mockStations = [
        { id: 1, name: "Station A", lat: 37.7749, lng: -122.4194 },
        { id: 2, name: "Station B", lat: 37.7849, lng: -122.4094 },
      ];
      setStations(mockStations);
    };
    fetchStations();
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      {currentPosition && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={defaultZoom}
        >
          {/* User's current position */}
          <Marker position={currentPosition} label="You" />

          {/* Charging stations */}
          {stations.map((station) => (
            <Marker
              key={station.id}
              position={{ lat: station.lat, lng: station.lng }}
              onClick={() => setSelectedStation(station)}
            />
          ))}

          {/* Info window for selected station */}
          {selectedStation && (
            <InfoWindow
              position={{ lat: selectedStation.lat, lng: selectedStation.lng }}
              onCloseClick={() => setSelectedStation(null)}
            >
              <div>
                <h3>{selectedStation.name}</h3>
                <button onClick={() => bookSlot(selectedStation.id)}>Book Slot</button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

const bookSlot = (stationId) => {
  alert(`Booking slot at station ${stationId}`);
};

export default MapComponent;
