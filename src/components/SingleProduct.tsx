import React from 'react';
import { Product } from '../service/productService';
import '../css/SingleProduct.css';

interface SingleProductProps {
    product: Product;
}
// If 'prop' is in the cart, modify accordingly
const SingleProduct: React.FC<SingleProductProps> = ({ product }) => {
    return (
        <div className="single-product">
            <h2>{product.title}</h2>
            <p>Price: {product.price} kr</p>
            <p>Category: {product.category}</p>
            <p>Short description: {product.shortDescription}</p>
            {product.imgURL.map((url, index) => (
                <img key={index} src={url} alt={`Image ${index}`} />
            ))}
        </div>
    );
};

export default SingleProduct;

