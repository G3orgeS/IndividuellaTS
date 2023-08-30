import React, { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../service/productService';
import SingleProduct from './SingleProduct';
import '../css/ProductList.css'; // Importera den nya CSS-filen

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchAndSetProducts() {
      const productsData = await fetchProducts();
      setProducts(productsData);
    }

    fetchAndSetProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="product-list-container">
      <h1>Products</h1>
      <ul className="product-list">
        {products.map((product, index) => (
          <li key={index} onClick={() => handleProductClick(product)}>
            {product.title}
            {/* : {product.price} */}
          </li>
        ))}
      </ul>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* <h2>Selected Product Details</h2> */}
            <SingleProduct product={selectedProduct} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
