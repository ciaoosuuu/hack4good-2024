import { useContext, createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../firebase/config";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setIsLoading(true);
            if (currentUser) {
                const ref = db.collection('Users').doc(currentUser.uid);
                const doc = await ref.get();
                if (!doc.exists) {
                    console.log('No such user!');
                } else {
                    setUser(doc.data());
                    console.log('User data:', doc.data());
                }
            } else {
                setUser(currentUser);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
