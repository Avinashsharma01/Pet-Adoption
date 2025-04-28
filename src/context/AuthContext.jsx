/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register new user
    const register = async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Update the user's display name
        await updateProfile(user, {
            displayName: name,
        });

        // Create a user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            userId: user.uid,
            name: name,
            email: email,
            createdAt: serverTimestamp(),
            contactDetails: {},
        });

        return user;
    };

    // Sign in with email and password
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Sign in with Google
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if the user document exists, if not create it
        await setDoc(
            doc(db, "users", user.uid),
            {
                userId: user.uid,
                name: user.displayName || "User",
                email: user.email,
                createdAt: serverTimestamp(),
                contactDetails: {},
            },
            { merge: true }
        );

        return user;
    };

    // Sign out the current user
    const logout = () => {
        return signOut(auth);
    };

    // Reset password
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        register,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
