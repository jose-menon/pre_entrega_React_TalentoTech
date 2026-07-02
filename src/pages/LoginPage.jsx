import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

export const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = ({ target }) => {
        setForm({
            ...form,
            [target.name]: target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loggedUser = await login(form.email, form.password);

            Swal.fire({
                icon: "success",
                title: "Sesión iniciada",
                text: `Bienvenido: ${loggedUser.email}`,
            });

            if (loggedUser.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: "Verifica tu email y contraseña",
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | Carrito</title>
            </Helmet>

            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-6 col-lg-4">
                    <h1>Iniciar sesión</h1>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            className="form-control mb-3"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            className="form-control mb-3"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                        <button className="btn btn-primary w-100" type="submit">
                            Ingresar
                        </button>
                    </form>

                    <p className="mt-3">
                        ¿No tenés cuenta? <Link to="/registro">Registrarse</Link>
                    </p>
                </div>
            </div>
        </>
    );
};