import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHRyQxKXsXnnECkL41HgWw_fPobRJ6LJ4",
  authDomain: "blog-app-3fb20.firebaseapp.com",
  projectId: "blog-app-3fb20",
  storageBucket: "blog-app-3fb20.firebasestorage.app",
  messagingSenderId: "662787468337",
  appId: "1:662787468337:web:ae666cf02fe56414c9f910",
  measurementId: "G-PCJYF6M2YZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

