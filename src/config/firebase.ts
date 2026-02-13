import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase keys are publishable/public — safe to include in client code
// TODO: Replace with your actual Firebase project values
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
