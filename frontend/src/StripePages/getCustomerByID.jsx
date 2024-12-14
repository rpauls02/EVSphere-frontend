import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function GetCustomerById() {
  const { id } = useParams(); // Extract 'id' from the URL path
  const [customerData, setCustomerData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCustomerById = async () => {
      setErrorMessage("");
      setCustomerData(null); // Clear previous data

      if (!id) {
        setErrorMessage("No Customer ID found in the URL.");
        return;
      }

      try {
        const response = await axios.get(`/StripeCustomers/${id}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
        setErrorMessage("Failed to fetch customer. Please check the ID and try again.");
      }
    };

    fetchCustomerById();
  }, [id]); // Runs when 'id' changes

  return (
    <div>
      <h2>Customer Details</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {customerData ? (
        <div>
          <h3>Customer Information</h3>
          <p><strong>ID:</strong> {customerData.id}</p>
          <p><strong>Name:</strong> {customerData.name || "N/A"}</p>
          <p><strong>Email:</strong> {customerData.email || "N/A"}</p>
          <p><strong>Description:</strong> {customerData.description || "N/A"}</p>
        </div>
      ) : (
        <p>Loading customer details...</p>
      )}
    </div>
  );
}
