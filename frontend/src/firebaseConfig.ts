import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDfPK1NS6i9IA2gbuqhhvHCnhaNLaRWymk",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ev-charging-management-s-74390.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ev-charging-management-s-74390",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ev-charging-management-s-74390.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "810099698857",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:810099698857:web:3d1c21ccb6ff9434c90db8",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://ev-charging-management-s-74390-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Set session persistence for authentication
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Session persistence set to local.");
  })
  .catch((error) => {
    console.error("Error setting session persistence:", error);
  });

// Listen for auth state changes to ensure persistence is working
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in: ", user);
  } else {
    console.log("No user is signed in.");
  }
});

export { auth, db, app, database};
