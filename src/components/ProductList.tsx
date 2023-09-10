import React, { useEffect, useState } from 'react';
import { fetchProducts, Product, deleteProduct } from '../service/productService';
import SingleProduct from './SingleProduct';
import '../css/ProductList.css';
import { AuthContext, useAuth } from '../../auth/AuthContext';

interface ProductListProps {
  isModalEnabled: boolean;
}

function ProductList({ isModalEnabled }: ProductListProps) {
  const { isLoggedIn, login, logout } = useAuth();
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
      console.log('Product ID:', product.id);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-list-container">
      <h1>Products</h1>
      <ul className="product-list">
        {products.map((product, index) => (
          <li key={index} onClick={() => handleProductClick(product)}>
            <div className="product-item">
              {product.imgURL.length > 0 && (
                <img src={product.imgURL[0]} alt={`Image 0`} className="productList-image" />
              )}
              <span className="product-title">{product.title}</span>
              {isLoggedIn && (
                <button
                  className="listdelete"
                  onClick={() => {
                    if (product.id) {
                      console.log('Product ID to be deleted:', product.id);
                      handleDeleteProduct(product.id.toString());
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedProduct && isModalEnabled && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            <SingleProduct product={selectedProduct} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
