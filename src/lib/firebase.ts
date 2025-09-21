
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMlW-CvE2jUwZioAFqHno2K9e8sB3GVNI",
  authDomain: "studio-7802347805-97b42.firebaseapp.com",
  projectId: "studio-7802347805-97b42",
  storageBucket: "studio-7802347805-97b42.firebasestorage.app",
  messagingSenderId: "397737367178",
  appId: "1:397737367178:web:7f34902d412cc8f2c93f73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
