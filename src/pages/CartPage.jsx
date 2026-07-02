import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import Swal from 'sweetalert2'
import { Helmet } from 'react-helmet-async'
import { FaShoppingBag, FaTrash } from 'react-icons/fa'

export const CartPage = () => {
    const {
        shoppingList,
        removeProduct,
        incrementQuantity,
        decrementQuantity,
        clearCart
    } = useContext(CartContext)

    const safeShoppingList = shoppingList.filter(product => product && product._id)

    const calculateTotal = () => {
        return safeShoppingList
            .reduce((total, product) => total + Number(product.price) * product.quantity, 0)
            .toFixed(2)
    }

    const handlerPurchase = () => {
        if (safeShoppingList.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Carrito vacío",
                text: "Debes agregar productos antes de comprar"
            })
            return
        }

        const productsPurchase = safeShoppingList
            .map(product => `${product.title} x ${product.quantity}`)
            .join('\n')

        Swal.fire({
            icon: 'success',
            title: 'La compra se realizó con éxito',
            html: `<p>Has comprado:</p> <pre>${productsPurchase}</pre>`
        })

        clearCart()
    }

    return (
        <>
            <Helmet>
                <title>Carrito | Carrito de Compras</title>
                <meta name='description' content='Productos Agregados al Carrito' />
            </Helmet>

            <h1 className="mt-4">Carrito</h1>
            <hr />

            {safeShoppingList.length === 0 ? (
                <div className="alert alert-info">
                    El carrito se encuentra vacío
                </div>
            ) : (
                <div className="table-responsive">
                    <table className='table align-middle'>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {safeShoppingList.map(product => (
                                <tr key={product._id}>
                                    <th>{product.title}</th>
                                    <td>${product.price}</td>
                                    <td>
                                        <button
                                            className='btn btn-outline-primary btn-sm'
                                            onClick={() => decrementQuantity(product._id)}
                                        >
                                            -
                                        </button>

                                        <span className="mx-2">{product.quantity}</span>

                                        <button
                                            className='btn btn-outline-primary btn-sm'
                                            onClick={() => incrementQuantity(product._id)}
                                        >
                                            +
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className='btn btn-danger btn-sm'
                                            onClick={() => removeProduct(product._id)}
                                        >
                                            <FaTrash /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            <tr>
                                <th><b>Total</b></th>
                                <td></td>
                                <td></td>
                                <td>${calculateTotal()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <div className='d-flex gap-2'>
                <button
                    className='btn btn-primary'
                    type='button'
                    onClick={handlerPurchase}
                >
                    <FaShoppingBag /> Comprar
                </button>

                <button
                    className="btn btn-outline-danger"
                    onClick={clearCart}
                >
                    Vaciar Carrito
                </button>
            </div>
        </>
    )
}