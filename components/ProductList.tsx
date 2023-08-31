import React, { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../service/productService';
import SingleProduct from './SingleProduct';
import '../css/ProductList.css';

interface ProductListProps {
  isModalEnabled: boolean;
}

function ProductList({ isModalEnabled }: ProductListProps) {
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
    if (isModalEnabled) {
      setSelectedProduct(product);
    }
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
          </li>
        ))}
      </ul>

      {selectedProduct && isModalEnabled && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SingleProduct product={selectedProduct} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;

