import { useContext, createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../firebase/config";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userEdited, setUserEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setIsLoading(true);
            if (currentUser) {
                const ref = db.collection('Users').doc(currentUser.uid);
                console.log("user data updated...")
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
    }, [auth, userEdited]);

    const callbackFunction = async () => {
        const ref = db.collection('Users').doc(currentUser.uid);
        console.log("user data updated...")
        const doc = await ref.get();
        if (!doc.exists) {
            console.log('No such user!');
        } else {
            setUser(doc.data());
            console.log('User data:', doc.data());
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, setUserEdited, callbackFunction }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
