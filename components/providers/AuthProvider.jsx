"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

const AuthContext = createContext({
    user: null,
    loading: true,
    updateUserProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeDoc = () => { };

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userRef = doc(db, "users", firebaseUser.uid);

                // Real-time listener for Firestore data
                unsubscribeDoc = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        // Merge Auth user and Firestore data
                        setUser({ ...firebaseUser, ...docSnap.data() });
                    } else {
                        // User doesn't exist in Firestore, create them
                        const newData = {
                            displayName: firebaseUser.displayName,
                            email: firebaseUser.email,
                            photoURL: firebaseUser.photoURL,
                            createdAt: serverTimestamp(),
                            freeInterviewCount: 3,
                            isSubscribed: false,
                        };
                        await setDoc(userRef, newData);
                        setUser({ ...firebaseUser, ...newData });
                    }
                    setLoading(false);
                });

            } else {
                setUser(null);
                setLoading(false);
                if (unsubscribeDoc) unsubscribeDoc();
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    const updateUserProfile = async (data) => {
        if (!auth.currentUser) return;
        try {
            await updateProfile(auth.currentUser, {
                displayName: data.displayName,
                photoURL: data.photoURL,
            });
            setUser({ ...auth.currentUser });

            // Update Firestore
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userRef, data, { merge: true });

            return true;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
