import { auth } from '../firebaseConfig';

const LogoutHandler = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export default LogoutHandler;
