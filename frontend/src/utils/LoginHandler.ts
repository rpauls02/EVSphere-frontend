import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, linkWithPopup  } from 'firebase/auth';
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
        navigate('/buyer-dashboard');
      } else if (userData.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  } catch (error) {
    setPopupMessage('Login failed. Please check the credentials you\'ve entered.');
    setIsErrorPopup(true);
    setShowPopup(true);
    console.error('Login error:', error);
  }
};

export const handleGoogleAuth = async (
  setError: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  onClose: () => void,
  navigate: (path: string) => void
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
      try {
          setLoading(true);
          const provider = new GoogleAuthProvider();
          await linkWithPopup(user, provider);
          navigate('/signup')
          console.log('Google account linked successfully!');
          onClose();
      } catch (error) {
          setError('Failed to link Google account. Please try again.');
          console.error(error);
      } finally {
          setLoading(false);
      }
  } else {
      setError('No authenticated user found.');
  }
};

