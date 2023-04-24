// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyCMA5aMBbNRqMsaNveZkP5g_6Utu6ybBPo",
  authDomain: "mydrive-8ae69.firebaseapp.com",
  projectId: "mydrive-8ae69",
  storageBucket: "mydrive-8ae69.appspot.com",
  messagingSenderId: "159070855667",
  appId: "1:159070855667:web:79148f41fc91fc5061f286"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
