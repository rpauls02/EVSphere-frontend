import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";

const ChargingAnalytics = () => {
  const { userId } = useParams(); // Get userId from the route
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const sessionsRef = ref(db, "ChargeSessionAnalytics");
  
    console.log("Querying sessions for userId:", userId);
  
    const userSessionsQuery = query(sessionsRef, orderByChild("userId"), equalTo(userId));
  
    get(userSessionsQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const sessionsArray = Object.entries(data).map(([sessionId, sessionData]) => ({
            sessionId,
            ...sessionData,
          }));
          setSessions(sessionsArray);
          console.log("Fetched user sessions:", sessionsArray);
        } else {
          console.log("No charging sessions found for this user.");
          console.log("Snapshot value:", snapshot.val()); // Additional debug
          setSessions([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user sessions:", error);
      });
  }, [userId]);
  
  return (
    <div>
      <h1>Charging Analytics for User: {userId}</h1>
      {sessions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Charger ID</th>
              <th>Status</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.sessionId}>
                <td>{session.chargerId}</td>
                <td>{session.status}</td>
                <td>{new Date(session.startTime).toLocaleString()}</td>
                <td>{session.endTime ? new Date(session.endTime).toLocaleString() : "In Progress"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No charging sessions found for this user.</p>
      )}
    </div>
  );
};

export default ChargingAnalytics;
