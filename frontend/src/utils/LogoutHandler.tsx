import { auth } from '../firebaseConfig';

const LogoutHandler = async () => {
  await auth.signOut();
};

export default LogoutHandler;
