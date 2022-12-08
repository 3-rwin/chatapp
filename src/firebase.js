// npm install firebase
// https://console.firebase.google.com/
// Create a new Project
// In the project create a new webapp
//Autenticate the app under Build -> Authentication enable Email/Password
// Add files build -> Storage

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../src/credentials/Credentials.js"


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
// Create a root reference
export const storage = getStorage();
// Create the db link to firestore
export const db = getFirestore();