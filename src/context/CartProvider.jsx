import React, { useReducer } from 'react'
import { CartContext } from './CartContext'

export const CartProvider = ({ children }) => {
    const initialState = []

    const cartReducer = (state = initialState, action = {}) => {
        switch (action.type) {
            case "[CART] Add Product": {
                if (!action.payload || !action.payload._id) {
                    return state
                }

                const productExists = state.find(
                    product => product && product._id === action.payload._id
                )

                if (productExists) {
                    return state.map(product =>
                        product._id === action.payload._id
                            ? { ...product, quantity: product.quantity + 1 }
                            : product
                    )
                }

                return [
                    ...state,
                    {
                        ...action.payload,
                        quantity: 1
                    }
                ]
            }

            case "[CART] Remove Product":
                return state.filter(product => product && product._id !== action.payload)

            case "[CART] Increment Quantity":
                return state.map(product =>
                    product && product._id === action.payload
                        ? { ...product, quantity: product.quantity + 1 }
                        : product
                )

            case "[CART] Decrement Quantity":
                return state.map(product =>
                    product && product._id === action.payload && product.quantity > 1
                        ? { ...product, quantity: product.quantity - 1 }
                        : product
                )

            case "[CART] Clear Cart":
                return []

            default:
                return state
        }
    }

    const [shoppingList, dispatch] = useReducer(cartReducer, initialState)

    const addProduct = (product) => {
        if (!product || !product._id) {
            console.error("Producto inválido:", product)
            return
        }

        dispatch({
            type: "[CART] Add Product",
            payload: product
        })
    }

    const removeProduct = (id) => {
        dispatch({
            type: "[CART] Remove Product",
            payload: id
        })
    }

    const incrementQuantity = (id) => {
        dispatch({
            type: "[CART] Increment Quantity",
            payload: id
        })
    }

    const decrementQuantity = (id) => {
        dispatch({
            type: "[CART] Decrement Quantity",
            payload: id
        })
    }

    const clearCart = () => {
        dispatch({
            type: "[CART] Clear Cart"
        })
    }

    return (
        <CartContext.Provider
            value={{
                shoppingList,
                addProduct,
                removeProduct,
                incrementQuantity,
                decrementQuantity,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}