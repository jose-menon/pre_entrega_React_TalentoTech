import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { NavBarComponent } from './component/NavBarComponent'
import { CartProvider } from './context/CartProvider'
import { ProductProvider } from './context/ProductProvider'
import { CartPage } from './pages/CartPage'
import { ProductsPages } from './pages/ProductsPages'
import { FooterComponent } from './component/FooterComponent'
import { PersonasProvider } from './context/PersonasProvider'

export const CarritoApp = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <NavBarComponent />
        <div className='container'>
          <Routes>
            <Route path='/' element={<ProductsPages></ProductsPages>}></Route>
            <Route path='/carrito' element={<CartPage></CartPage>}>Carrito</Route>
            <Route path='/*' element={<Navigate to="/" />}>Carrito</Route>
          </Routes>
        </div>
        <PersonasProvider>
          <FooterComponent />
        </PersonasProvider>
      </CartProvider>
    </ProductProvider>
  )
}
