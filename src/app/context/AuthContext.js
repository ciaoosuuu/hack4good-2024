import { useContext, createContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase/config"

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const ref = db.collection('Users').doc(currentUser.uid);
                const doc = await ref.get();
                if (!doc.exists) {
                    console.log('No such user!');
                } else {
                    setUser(currentUser);
                    console.log('User data:', doc.data());
                }
            }
        });
        return () => unsubscribe();
    }, [user]);

    // useEffect(() => {
    //     // Check if user is not authenticated
    //     if (!user) {
    //       // Redirect to the login page
    //       router.push('/account/login');
    //     }
    //   }, [user, router]);

    // useEffect(() => {
    //     const checkAuthentication = async () => {
    //       await new Promise((resolve) => setTimeout(resolve, 50));
    //       setLoading(false);
    //     };
    //     checkAuthentication();
    //   }, [user]);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
