import React, { useContext, useMemo, useState } from 'react'
import { ProductContext } from '../context/ProductContext'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { CardComponent } from '../component/CardComponent'
import { Helmet } from 'react-helmet-async'

export const ProductsPages = () => {
    const { products, loadingProducts, errorProducts } = useContext(ProductContext)
    const { addProduct, removeProduct } = useContext(CartContext)
    const { user } = useContext(AuthContext)

    const [search, setSearch] = useState("")
    const [currentPage, setcurrentPage] = useState(1)

    const productsPerPage = 6

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.title.toLowerCase().includes(search.toLowerCase())
        )
    }, [products, search])

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    )

    const handleSearch = ({ target }) => {
        setSearch(target.value)
        setcurrentPage(1)
    }

    return (
        <>
            <Helmet>
                <title>Productos</title>
                <meta name='description' content='Catálogo de Productos Disponibles para la Compra' />
            </Helmet>

            <h1 className='mt-4'>Productos</h1>
            <hr />

            {!user && (
                <div className="alert alert-info">
                    Para agregar productos al carrito debes iniciar sesión.
                </div>
            )}

            <input
                type='text'
                className='form-control mb-4'
                placeholder='Buscar Producto...'
                value={search}
                onChange={handleSearch}
            />

            {loadingProducts && (
                <div className="text-center">
                    <div className="spinner-border" role='status'></div>
                </div>
            )}

            {errorProducts && (
                <div className="alert alert-danger">{errorProducts}</div>
            )}

            <div className="row">
                {paginatedProducts.map((product) => (
                    <div
                        key={product._id}
                        className="col-12 col-md-6 col-lg-4 mb-4"
                    >
                        <CardComponent
                            id={product._id}
                            image={product.image}
                            title={product.title}
                            description={product.description}
                            price={product.price}
                            canAddToCart={!!user}
                            handlerAdd={() => addProduct(product)}
                            handlerRemove={() => removeProduct(product._id)}
                        />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: totalPages }, (_, index) =>
                            <li
                                key={index + 1}
                                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                            >
                                <button
                                    onClick={() => setcurrentPage(index + 1)}
                                    className="page-link"
                                >
                                    {index + 1}
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </>
    )
}