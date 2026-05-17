import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { ProductContext } from './ProductContext'

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/public/productos.json')
            const data = await response.json()
            setProducts(data.data)
        } catch (error) {
            Swal.fire
                (
                    {
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Ocurrio un error al cargar los productos'
                    }
                )
                console.error(error)
        }
    }
    useEffect(() => {
        fetchProducts()
        return () => {
        }
    }, [])

    return (
        <ProductContext.Provider value={{ products }}>
            {children}
        </ProductContext.Provider>
    )
}
