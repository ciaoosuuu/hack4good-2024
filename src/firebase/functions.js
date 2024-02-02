import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./config"

const emailPwSignIn = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
}

const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
};

const emailPwSignUp = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}

const logOut = async () => {
    return await signOut(auth);
};

export { emailPwSignIn, emailPwSignUp, logOut, googleSignIn};
