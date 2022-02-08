// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB74i-Bh1_PTbLPNT4MAcgHEkflGh3vT2E",
  authDomain: "insta-clone-155c9.firebaseapp.com",
  projectId: "insta-clone-155c9",
  storageBucket: "insta-clone-155c9.appspot.com",
  messagingSenderId: "786213238846",
  appId: "1:786213238846:web:8eba4010d51ccef04cf96f",
};

// Initialize Firebase
// When you are using server side rendering, it could have already initialized the app, then you SSR and it has two instances
// Singleton Pattern: Get apps from firebase, if length of that array is zero, then initialize app, else get current app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
