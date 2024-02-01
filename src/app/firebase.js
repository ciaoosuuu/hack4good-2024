// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_SOcmlZyzWv13Vd9R-_-8OOFiWdydy-Y",
    authDomain: "hackforgood-mvc.firebaseapp.com",
    projectId: "hackforgood-mvc",
    storageBucket: "hackforgood-mvc.appspot.com",
    messagingSenderId: "665682992067",
    appId: "1:665682992067:web:58ee68671e0dfba0a13b76",
    measurementId: "G-HJDVK6D1X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
