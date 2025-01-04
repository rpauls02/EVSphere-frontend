import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getDatabase, ref, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

const ActiveChargingSession = () => {
  const { chargerId } = useParams();
  const [chargingPercentage, setChargingPercentage] = useState(0); // % Charged
  const [isCharging, setIsCharging] = useState(false);
  const [status, setStatus] = useState("Waiting to start...");
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [stripeCustomerId, setStripeCustomerId] = useState(null);

  // Variables to track during charging
  const [pricePerKWh] = useState(0.45); // £0.45 per kWh
  const [currentKW, setCurrentKW] = useState(0);
  const [timeSoFar, setTimeSoFar] = useState(0); // Seconds
  const [remainingTime, setRemainingTime] = useState("Calculating...");

  useEffect(() => {
    const fetchUserAndStripeCustomerId = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const fetchedUserId = user.uid;
        setUserId(fetchedUserId);
        console.log("User ID:", fetchedUserId);

        // Fetch Stripe customer ID
        try {
          const userDoc = await getDoc(doc(db, "users", fetchedUserId));
          if (userDoc.exists()) {
            const stripeId = userDoc.data().stripeCustomerId;
            setStripeCustomerId(stripeId);
            console.log("Stripe Customer ID:", stripeId);
          } else {
            console.error("User document not found for ID:", fetchedUserId);
          }
        } catch (error) {
          console.error("Error fetching Stripe customer ID:", error);
        }
      } else {
        console.error("No user is signed in.");
      }
    };

    fetchUserAndStripeCustomerId();
  }, []);

    // Load and parse the CSV file
    useEffect(() => {
      const fetchCsvData = async () => {
        try {
          const response = await fetch("/output_0.csv");
          const text = await response.text();
  
          // Parse the first line of the CSV
          const firstLine = text.split("\n")[0];
          setRemainingTime(firstLine || "Unable to fetch remaining time");
        } catch (error) {
          console.error("Error fetching CSV file:", error);
          setRemainingTime("Error fetching data");
        }
      };
  
      fetchCsvData();
    }, []);
  
    const handleStartCharging = async () => {
      const db = getDatabase();
  
      if (!userId) {
        console.error("User ID is not set. Cannot start charging.");
        return;
      }
  
      // Create a unique session ID and save it
      const newSessionId = `${chargerId}_${userId}_${Date.now()}`;
      setSessionId(newSessionId);
  
      const sessionRef = ref(db, `ChargeSessionAnalytics/${newSessionId}`);
  
      try {
        // Create the session document
        await set(sessionRef, {
          userId,
          chargerId,
          chargingPercentage: 0,
          currentKW: 0,
          timeSoFar: 0,
          status: "active",
          startTime: new Date().toISOString(),
        });
  
        console.log("Session started in database:", newSessionId);
        setStatus("Charging session started");
        setIsCharging(true);
  
        // Simulate charging progress
        const interval = setInterval(() => {
          setChargingPercentage((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setStatus("Charging session completed");
              setIsCharging(false);
  
              // Mark session as complete in the database
              update(sessionRef, { status: "completed" });
              postCombinedInvoice();
              return 100;
            }
  
            // Update local variables
            const newKW = Math.random() * 4 + 6; // Simulate 6-10 kW draw
            const timeIncrement = 1; // 1 second interval
  
            const roundedKW = parseFloat(newKW.toFixed(2));
            setCurrentKW(roundedKW);
            setTimeSoFar((prevTime) => prevTime + timeIncrement);
  
            // Update database
            update(sessionRef, {
              chargingPercentage: prev + 10,
              currentKW: roundedKW,
              timeSoFar: timeSoFar + timeIncrement,
            });
  
            return prev + 10; // Increment by 10%
          });
        }, 1000); // Update every second
      } catch (error) {
        console.error("Failed to start session in database:", error);
      }
    };

    const postCombinedInvoice = async () => {
      try {
          if (!stripeCustomerId) {
              console.error("Stripe Customer ID is not set. Cannot create invoice.");
              return;
          }

          // Step 1: Create the Product
          const productResponse = await axios.post('http://localhost:3002/StripeProduct/createProduct', {
              description: "EV Charging Session",
          });
          const productId = productResponse.data.productId;
          console.log("Product created successfully:", productId);

          // Step 2: Create the Price
          const priceResponse = await axios.post('http://localhost:3002/StripePrices/create-price', {
              currency: 'gbp',
              product: productId,
              unit_amount: Math.round(50.25 * 100), // Example: £50.25 in pence
          });
          const priceId = priceResponse.data.id;
          console.log("Price created successfully:", priceId);

          console.log("Stripe Customer ID:", stripeCustomerId);
          console.log("Price ID:", priceId); 
          // Step 3: Call the Combined Invoice API
          const invoiceResponse = await axios.post('http://localhost:3002/StripeInvoices/createInvoiceWithItem', {
              customer: stripeCustomerId,
              priceId,
          });
          console.log("invoice item:", invoiceResponse); // Debug for invoice item
          console.log("Invoice Item Details:", invoiceResponse.data.invoiceItem); // Debug for invoice item
          console.log("Invoice Created Successfully:", invoiceResponse.data.invoice); // Debug for invoice
      } catch (error) {
          console.error("Error creating price or invoice with item:", error.response?.data || error.message);
      }
  };

  return (
    <div>
      <h1>Charging Point: {chargerId}</h1>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Charging Progress:</strong> {chargingPercentage}%</p>

      {!isCharging && (
        <button onClick={handleStartCharging} disabled={isCharging || chargingPercentage >= 100}>
          Start Charging
        </button>
      )}

      {isCharging && (
        <div>
          <p><strong>Price per kWh:</strong> £{pricePerKWh}</p>
          <p><strong>Current KW Usage:</strong> {currentKW} kW</p>
          <p><strong>Time So Far:</strong> {`${Math.floor(timeSoFar / 60)}m ${timeSoFar % 60}s`}</p>
          <p><strong>Time taken for full charge:</strong> {remainingTime}</p>
        </div>
      )}

      {sessionId && (
        <a href={`/analytics/${userId}`} target="_blank" rel="noopener noreferrer">
          View Charging Analytics
        </a>
      )}
    </div>
  );
};

export default ActiveChargingSession;



