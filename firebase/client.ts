// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDl_d4vYNDopo6PQNfi9041MntrVHelb6c',
  authDomain: 'testai-agent.firebaseapp.com',
  projectId: 'testai-agent',
  storageBucket: 'testai-agent.firebasestorage.app',
  messagingSenderId: '903874370122',
  appId: '1:903874370122:web:f76a3459966d64841f24b3',
  measurementId: 'G-7YC5P1B0RM',
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export const auth = getAuth(app);
export const db = getFirestore(app);
