import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GetAllCustomers() {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get('/StripeCustomers?timestamp=' + new Date().getTime());
          setCustomerList(response.data.data); // Set the customer list to the "data" array
          setLoading(false);
          console.log("Customer List: ", response.data.data);
        } catch (error) {
          console.error("Error fetching customers: ", error);
          setError('Failed to fetch customers. Please try again later.');
        }
      };
      
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test Route</h1>

      {loading && <p>Loading customers...</p>}
      {error && <p>{error}</p>}

      {customerList.length > 0 ? (
        <div>
          <h2>Customer List</h2>
          {customerList.map((customer, index) => (
            <div key={customer.id}>
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
}