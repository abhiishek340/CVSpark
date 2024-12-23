import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBhhw-KzG4TTvlaa2yNhbcn1Ig3ujStmi8",
    authDomain: "blackmarker-d6d25.firebaseapp.com",
    projectId: "blackmarker-d6d25",
    storageBucket: "blackmarker-d6d25.appspot.com",
    messagingSenderId: "600971947453",
    appId: "1:600971947453:web:23160524720c099e5276d4",
    measurementId: "G-8WSLE8DE3F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Import these functions dynamically when needed
const getFirestoreFunctions = async () => {
    const { doc, getDoc } = await import('firebase/firestore') as any;
    return { doc, getDoc };
};

export { auth, db, getFirestoreFunctions };
