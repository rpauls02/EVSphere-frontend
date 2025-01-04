import React, { useState } from "react";
import axios from "axios";

export default function AddCustomerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("/StripeCustomers/createCustomer", {
        name,
        email,
      });
      console.log("Response:", response.data);

      setSuccessMessage("Customer added successfully!");
      setName(""); // Clear the form fields
      setEmail("");
    } catch (error) {
      console.error("Error adding customer:", error);
      setErrorMessage("Failed to add customer. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add a New Customer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer's name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter customer's email"
            required
          />
        </div>
        <button type="submit">Add Customer</button>
      </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
