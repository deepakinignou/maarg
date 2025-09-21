
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "studio-7802347805-97b42",
  appId: "1:397737367178:web:7f34902d412cc8f2c93f73",
  storageBucket: "studio-7802347805-97b42.firebasestorage.app",
  apiKey: "AIzaSyBMlW-CvE2jUwZioAFqHno2K9e8sB3GVNI",
  authDomain: "studio-7802347805-97b42.firebaseapp.com",
  messagingSenderId: "397737367178",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
