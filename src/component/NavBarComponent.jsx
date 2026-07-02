import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { Badge } from "@mui/material";

export const NavBarComponent = () => {
    const { shoppingList } = useContext(CartContext);
    const { user, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand">
                    Custom Shopping
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink to="/" className="nav-link">
                            Productos
                        </NavLink>

                        {user && (
                            <NavLink to="/carrito" className="nav-link">
                                Carrito
                            </NavLink>
                        )}

                        {isAdmin && (
                            <NavLink to="/admin" className="nav-link">
                                <FaUserShield /> Admin
                            </NavLink>
                        )}

                        {!user ? (
                            <NavLink to="/login" className="nav-link">
                                <FaUser /> Login
                            </NavLink>
                        ) : (
                            <button className="btn btn-link nav-link" onClick={handleLogout}>
                                <FaSignOutAlt /> Salir
                            </button>
                        )}
                    </div>
                </div>

                {user && (
                    <NavLink className="cart-icon" to="/carrito">
                        <Badge badgeContent={shoppingList.length} color="primary">
                            <FaShoppingCart />
                        </Badge>
                    </NavLink>
                )}
            </div>
        </nav>
    );
};