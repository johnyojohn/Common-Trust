import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAi1OD1NbsLxSU090CDUNPXv7cO9e82Ops",
    authDomain: "common-trust.firebaseapp.com",
    projectId: "common-trust",
    storageBucket: "common-trust.appspot.com",
    messagingSenderId: "481918358451",
    appId: "1:481918358451:web:7a51cfb1238990d346b1c6",
    measurementId: "G-6ZSV8G88F2"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };