import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const PrivateRoute = ({ children }) => {
    const { user, checkingAuth } = useContext(AuthContext);

    if (checkingAuth) {
        return <p className="text-center mt-5">Cargando usuario...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}