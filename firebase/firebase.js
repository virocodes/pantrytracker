// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPt3fUOQaD77NWi9qhDGUujLiFjMRUgDY",
    authDomain: "pantry-tracker-3f48d.firebaseapp.com",
    projectId: "pantry-tracker-3f48d",
    storageBucket: "pantry-tracker-3f48d.appspot.com",
    messagingSenderId: "998763540947",
    appId: "1:998763540947:web:684d2dc09e806a93033f26"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});


export {app, firestore, auth, googleProvider}