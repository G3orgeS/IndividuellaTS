import { useEffect, useState } from 'react';
import { Product, deleteProduct, fetchProductsSortedByCreatedAt } from '../service/productService';
import SingleProduct from './SingleProduct';
import '../css/ProductList.css';
import { useAuth } from '../auth/AuthContext';
import Loader from './Loader';

interface ProductListProps {
  isModalEnabled: boolean;
}

function ProductList({ isModalEnabled }: ProductListProps) {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [canOpenModal, setCanOpenModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(true);

  // Function to toggle the sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isModalEnabled) {
      closeModal();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isModalEnabled]);

  useEffect(() => {
    async function fetchAndSetProducts() {
      setLoading(true);
      const productsData = await fetchProductsSortedByCreatedAt(sortOrder);
      setProducts(productsData);
      setLoading(false);

      if (selectedProduct) {
        setModalLoading(false); 
      }
    }

    fetchAndSetProducts();
  }, [sortOrder, selectedProduct]);


  // Handle a click on a product item
  const handleProductClick = (product: Product) => {
    if (isModalEnabled && canOpenModal) {
      setSelectedProduct(product);
      setModalLoading(true); 
      console.log('Product ID:', product.id);
    }
  };

  // Close the modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Handle the deletion of a product
  const handleDeleteProduct = async (productId: string) => {
    try {
      setCanOpenModal(false);
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setCanOpenModal(true);
    }
  };

  return (
    <div className="product-list-container">
      {loading ? (
        <Loader />
      ) : (
        <ul className="product-list">
          <h1>Products</h1>
          <div className="sortwrapper">
            <button className='btn-sort' onClick={toggleSortOrder}>
              Sort latest added {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
          {products.map((product, index) => (
            <li key={index} onClick={() => handleProductClick(product)}>
              <div className="product-item">
                {product.imgURL.length > 0 && (
                  <img src={product.imgURL[0]} alt={`Image 0`} className="productList-image" />
                )}
                <span className="product-title">{product.title}</span>
                {isLoggedIn && isModalEnabled && (
                  <button
                    className="listdelete"
                    onClick={(e) => {
                      e.stopPropagation()
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
      )}
      {selectedProduct && isModalEnabled && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            {modalLoading ? (
              <Loader /> 
            ) : (
              <SingleProduct product={selectedProduct} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default ProductList;