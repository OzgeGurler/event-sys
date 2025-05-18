import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBZq8Eg2r-482cKhAjnaBXFrMMOJk5fDXE",
    authDomain: "react-event-e5d31.firebaseapp.com",
    projectId: "react-event-e5d31",
    storageBucket: "react-event-e5d31.firebasestorage.app",
    messagingSenderId: "353583338954",
    appId: "1:353583338954:web:2cda89532882683598eb33",
    measurementId: "G-B5RFS3Z39B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
    // Safari ve bazı tarayıcılarda CORS/streaming hatası yaşamamak için
    experimentalForceLongPolling: true,
    // useFetchStreams: false, // gerekirse bunu da açabilirsin
});

export const auth = getAuth(app);