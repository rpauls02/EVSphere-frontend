import { auth } from "../firebaseConfig";
import { browserLocalPersistence, setPersistence } from "firebase/auth";

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Session persistence set to local.");
  })
  .catch((error) => {
    console.error("Error setting session persistence:", error);
  });