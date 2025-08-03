import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- IMPORTANT ---
// Replace this with the firebaseConfig object you copied from the Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyB3wbXbOy1-5F6Xl9XGJa-8zJvin67OO_s",
    authDomain: "personal-imdb-6ccfd.firebaseapp.com",
    projectId: "personal-imdb-6ccfd",
    storageBucket: "personal-imdb-6ccfd.firebasestorage.app",
    messagingSenderId: "495979434436",
    appId: "1:495979434436:web:cf5afd8c98bdd45af89491"
};
    

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);