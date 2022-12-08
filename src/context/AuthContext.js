import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, createContext, useState } from 'react';
import { auth } from "../firebase";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser,setCurrentUser] = useState({})

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
            console.log(user);
        });

        // If you are listening in a realtime operation (onAuthStateChanged is listening)
        // you should use a cleanup function otherwise it will cause memory leaking
        return () => {
            unsub();
        };

    },[]);

    return (
        // Route the children
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}