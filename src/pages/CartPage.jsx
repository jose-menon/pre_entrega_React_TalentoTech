import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import Swal from 'sweetalert2'

export const CartPage = () => {
    const { shoppingList, removeProduct, incrementQuantity, decrementQuantity } = useContext(CartContext)

    const calculateTotal = () => {
        return shoppingList.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)
    }

    const handlerPurchase = () => {
        const productsPurchase = shoppingList.map(product => `${product.title} x ${product.quantity}`).join('\n')
        Swal.fire(
            {
                icon: 'success',
                title: 'La compra se realizó con éxito',
                html: `<p>Has comporado: </p> <pre>${productsPurchase}</pre>`
            }
        )
    }
    return (
        <>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope='col'>Nombre</th>
                        <th scope='col'>precio</th>
                        <th scope='col'>Cantidad</th>
                        <th scope='col'>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {shoppingList.map(product => (
                        <tr key={product._id}>
                            <th scope='row'>{product.title}</th>
                            <td>{product.price}</td>
                            <td>
                                <button
                                    className='btn btn-outline-primary'
                                    onClick={() => decrementQuantity(product._id)}>
                                    -
                                </button>
                                <button className='btn btn-primary'>{product.quantity}</button>
                                <button
                                    className='btn btn-outline-primary'
                                    onClick={() => incrementQuantity(product._id)}>+</button>
                            </td>
                            <td>
                                <button className='btn btn-danger'
                                    onClick={() => removeProduct(product._id)}>Eliminar</button>
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
            <div>
                <button
                    className='btn btn-primary'
                    type='button'
                    onClick={handlerPurchase}>Comprar</button>
            </div>
        </>
    )
}
