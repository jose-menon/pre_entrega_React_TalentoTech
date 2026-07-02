import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const buildUserWithRole = async (firebaseUser) => {
    if (!firebaseUser) return null;

    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: firebaseUser.email,
        role: "user",
        createdAt: new Date(),
      });

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: "user",
      };
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: userSnap.data().role || "user",
    };
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userWithRole = await buildUserWithRole(userCredential.user);

      setUser(userWithRole);

      return userWithRole;
    } catch (error) {
      console.error("Error Firebase:", error.code, error.message);

      if (error.code === "auth/email-already-in-use") {
        throw new Error("El correo ya está registrado.");
      }

      if (error.code === "auth/invalid-email") {
        throw new Error("El correo ingresado no es válido.");
      }

      if (error.code === "auth/weak-password") {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      if (error.code === "auth/operation-not-allowed") {
        throw new Error(
          "Debes habilitar Email/Password en Firebase Authentication."
        );
      }

      throw new Error("No se pudo registrar el usuario.");
    }
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userWithRole = await buildUserWithRole(userCredential.user);

    setUser(userWithRole);

    return userWithRole;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        const userWithRole = await buildUserWithRole(firebaseUser);
        setUser(userWithRole);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        checkingAuth,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};