// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { browser } from "$app/environment";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtixkjG7nJqo5eeYoKdwC-tGE91Cyh-xU",
  authDomain: "prosiya-e751a.firebaseapp.com",
  projectId: "prosiya-e751a",
  storageBucket: "prosiya-e751a.firebasestorage.app",
  messagingSenderId: "942686815915",
  appId: "1:942686815915:web:013028a18690a8bf8959ee",
  measurementId: "G-GMZDXPCYYP"
};

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Initialize services only in browser to avoid issues during SSR with analytics/auth
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

let analytics;
if (browser) {
    analytics = getAnalytics(app);
}

export { app, analytics };
