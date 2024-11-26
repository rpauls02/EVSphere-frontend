import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

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

export { auth, db, app };
