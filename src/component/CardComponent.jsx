import React, { useContext, useEffect, useState } from 'react'
import '../styles/CardComponent.css'
import { CartContext } from '../context/CartContext'

export const CardComponent = ({
    id,
    image,
    title,
    description,
    price,
    handlerAdd,
    handlerRemove,
    canAddToCart
}) => {
    const { shoppingList } = useContext(CartContext)
    const [added, setAdded] = useState(false)

    const addProduct = () => {
        if (!canAddToCart) return
        handlerAdd()
        setAdded(true)
    }

    const removeProduct = () => {
        if (!canAddToCart) return
        handlerRemove()
        setAdded(false)
    }

    const checkAdded = () => {
        const boolean = shoppingList.some(
            product => product && product._id === id
        )

        setAdded(boolean)
    }

    useEffect(() => {
        checkAdded()
    }, [shoppingList, id])

    return (
        <div className='card'>
            <img src={image} alt={title} className='card-img' />

            <div className='card-content'>
                <h3 className='card-title'>{title}</h3>
                <p className='card-description'>{description}</p>
                <p className='card-price'>${price}</p>

                {canAddToCart && (
                    <>
                        {added ? (
                            <button
                                type='button'
                                className='remove-button'
                                onClick={removeProduct}
                            >
                                Quitar del Carrito
                            </button>
                        ) : (
                            <button
                                type='button'
                                className='add-button'
                                onClick={addProduct}
                            >
                                Agregar al Carrito
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}