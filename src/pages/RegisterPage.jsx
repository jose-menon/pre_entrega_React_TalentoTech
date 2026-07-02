import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

export const RegisterPage = () => {
    const { register } = useContext(AuthContext);
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

        if (form.password.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La contraseña debe tener al menos 6 caracteres",
            });
            return;
        }

        try {
            await register(form.email, form.password);

            Swal.fire({
                icon: "success",
                title: "Cuenta creada",
                text: "Tu usuario fue registrado correctamente",
            });

            navigate("/");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al registrarse",
                text: "No se pudo crear la cuenta. Verifica los datos ingresados.",
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Registro | Carrito</title>
            </Helmet>

            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-6 col-lg-4">
                    <h1>Registro</h1>

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

                        <button className="btn btn-success w-100" type="submit">
                            Crear cuenta
                        </button>
                    </form>

                    <p className="mt-3">
                        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
                    </p>
                </div>
            </div>
        </>
    );
};