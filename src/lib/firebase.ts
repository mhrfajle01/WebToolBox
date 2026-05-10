import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiJKx7ILAe6juvmSlEOFfvrxibm51Cm_E",
  authDomain: "webtoolbox-df438.firebaseapp.com",
  projectId: "webtoolbox-df438",
  storageBucket: "webtoolbox-df438.firebasestorage.app",
  messagingSenderId: "342441808472",
  appId: "1:342441808472:web:47d3ed0d418232f548702d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
