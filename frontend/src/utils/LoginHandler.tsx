import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const handleLogin = async (
  email: string,
  password: string,
  setPopupMessage: React.Dispatch<React.SetStateAction<string>>,
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
  setIsErrorPopup: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: (path: string) => void
) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === 'buyer') {
        setPopupMessage('Login successful!');
        setIsErrorPopup(false);
        navigate('/buyer-dashboard');
      } else if (userData.role === 'seller') {
        setPopupMessage('Login successful!');
        setIsErrorPopup(false);
        navigate('/seller-dashboard');
      } else {
        setPopupMessage('Login successful!');
        setIsErrorPopup(false);
        navigate('/user-dashboard');
      }
    }
  } catch (error) {
    setPopupMessage('Login failed. Please check your credentials.');
    setIsErrorPopup(true);
    setShowPopup(true);
    console.error('Login error:', error);
  }
};
