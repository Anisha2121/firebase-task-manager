// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6YuS0Ha6LcyJV_tV6VJ33yGI7zoPwlag",
  authDomain: "dummy-ea58e.firebaseapp.com",
  projectId: "dummy-ea58e",
  storageBucket: "dummy-ea58e.appspot.com",
  messagingSenderId: "743005423452",
  appId: "1:743005423452:web:68dc9e530c4cc0e1822399",
  measurementId: "G-LFLKR3N1JE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);