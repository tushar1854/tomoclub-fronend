import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCCjYxbE1b6CKoNzy8BI7qSG0NnYvGP6LA',
  authDomain: 'tomoclub-dev.firebaseapp.com',
  projectId: 'tomoclub-dev',
  storageBucket: 'tomoclub-dev.appspot.com',
  messagingSenderId: '184876917051',
  appId: '1:184876917051:web:ff2da4eab219508563971e',
  measurementId: 'G-SJNCMH731K'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
