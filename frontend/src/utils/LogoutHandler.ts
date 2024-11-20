import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const LogoutHandler = async (navigate: any) => {
  try {
    await auth.signOut();
    navigate('/login');
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export default LogoutHandler;
