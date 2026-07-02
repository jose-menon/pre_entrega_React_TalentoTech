import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { NavBarComponent } from "./component/NavBarComponent";
import { CartProvider } from "./context/CartProvider";
import { ProductProvider } from "./context/ProductProvider";
import { AuthProvider } from "./context/AuthProvider";
import { CartPage } from "./pages/CartPage";
import { ProductsPages } from "./pages/ProductsPages";
import { FooterComponent } from "./component/FooterComponent";
import { PersonasProvider } from "./context/PersonasProvider";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { AdminRoute } from "./routes/AdminRoute";
import { PrivateRoute } from "./routes/PrivateRoute";

export const CarritoApp = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <NavBarComponent />

          <main className="container">
            <Routes>
              <Route path="/" element={<ProductsPages />} />
              <Route
                path="/carrito"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminProductsPage />
                  </AdminRoute>
                }
              />

              <Route path="/*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <PersonasProvider>
            <FooterComponent />
          </PersonasProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};