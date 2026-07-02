import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { ProductContext } from './ProductContext'
import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    where
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [errorProducts, setErrorProducts] = useState(null)

    const productsCollection = collection(db, "products")

    const fetchProducts = async () => {
        setLoadingProducts(true)
        setErrorProducts(null)

        try {
            const response = await getDocs(productsCollection)

            const data = response.docs.map((document) => ({
                _id: document.id,
                ...document.data()
            }))

            setProducts(data)
        } catch (error) {
            setErrorProducts("Error al cargar los Productos")

            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Ocurrió un error al cargar los productos'
            })

            console.error(error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const addProduct = async (product) => {
        try {
            await addDoc(productsCollection, product)
            await fetchProducts()

            Swal.fire({
                icon: "success",
                title: "Producto agregado",
                text: "El producto fue agregado correctamente"
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El producto no se pudo agregar"
            })

            console.error(error)
        }
    }

    const editProduct = async (id, product) => {
        try {
            const productRef = doc(db, "products", id)

            await updateDoc(productRef, product)
            await fetchProducts()

            Swal.fire({
                icon: "success",
                title: "Producto actualizado",
                text: "Producto actualizado correctamente"
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo actualizar el producto"
            })

            console.error(error)
        }
    }

    const deleteProduct = async (id) => {
        try {
            const result = await Swal.fire({
                title: "¿Desea eliminar el producto?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            })

            if (!result.isConfirmed) return

            const productRef = doc(db, "products", id)

            await deleteDoc(productRef)
            await fetchProducts()

            Swal.fire({
                icon: "success",
                title: "Producto eliminado",
                text: "Producto eliminado correctamente"
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El producto no pudo ser eliminado"
            })

            console.error(error)
        }
    }
    //migracion temporal para cargar los productos desde productos.json, evitamos la carga manual
    const migrateProductsFromJson = async () => {
        try {
            setLoadingProducts(true)

            const response = await fetch('/productos.json')
            const json = await response.json()

            const productsToImport = json.data || []

            if (productsToImport.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Sin productos",
                    text: "No se encontraron productos para importar"
                })
                return
            }

            let imported = 0
            let duplicated = 0

            for (const product of productsToImport) {
                const productQuery = query(
                    productsCollection,
                    where("title", "==", product.title)
                )

                const existingProduct = await getDocs(productQuery)

                if (!existingProduct.empty) {
                    duplicated++
                    continue
                }

                await addDoc(productsCollection, {
                    title: product.title,
                    description: product.description,
                    price: Number(product.price),
                    image: product.image
                })

                imported++
            }

            await fetchProducts()

            Swal.fire({
                icon: "success",
                title: "Migración finalizada",
                html: `
                    <p>Productos importados: <b>${imported}</b></p>
                    <p>Productos duplicados omitidos: <b>${duplicated}</b></p>
                `
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al migrar productos",
                text: "No se pudieron importar los productos desde el JSON"
            })

            console.error(error)
        } finally {
            setLoadingProducts(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <ProductContext.Provider
            value={{
                products,
                loadingProducts,
                errorProducts,
                fetchProducts,
                addProduct,
                editProduct,
                deleteProduct,
                migrateProductsFromJson
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}