import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const AdminRoute = ({ children }) => {
    const { user, checkingAuth, isAdmin } = useContext(AuthContext);

    if (checkingAuth) {
        return <p className="text-center mt-5">Validando permisos...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}