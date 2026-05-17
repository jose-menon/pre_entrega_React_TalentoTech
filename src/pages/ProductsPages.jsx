import React, { useContext } from 'react'
import { ProductContext } from '../context/ProductContext'
import { CartContext } from '../context/CartContext'
import { CardComponent } from '../component/CardComponent'

export const ProductsPages = () => {
    const { products } = useContext(ProductContext)
    const { addProduct, removeProduct } = useContext(CartContext)

    return (
        <>
            <h1>Productos</h1>
            <hr />
            {products.map(product => (
                <CardComponent
                    key={product._id}
                    id={product._id}
                    image={product.image}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    handlerAdd={() => addProduct(product)}
                    handlerRemove={() => removeProduct(product._id)} />
            ))}
        </>
    )
}
