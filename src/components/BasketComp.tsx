import { useState, useEffect } from 'react';
import { fetchProducts, Product } from '../service/productService';
import { addCartToDatabase } from '../service/cartService';
import '../css/Basket.css';

// Define a CartProduct interface that extends the Product interface
export interface CartProduct extends Product {
  quantity: number;
  cartItemId: number;
}

// Function to save the cart to local storage
const saveCartToLocalStorage = (cart: CartProduct[]) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to load the cart from local storage
const loadCartFromLocalStorage = (): CartProduct[] => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

// BasketComp component for displaying and managing the shopping basket
const BasketComp = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartProduct[]>(loadCartFromLocalStorage());
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cartItemIdCounter, setCartItemIdCounter] = useState<number>(1);

  // Fetch and set products from the service
  useEffect(() => {
    async function fetchAndSetProducts() {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    }
    fetchAndSetProducts();
  }, []);

  // Calculate and update the total price when the cart changes
  useEffect(() => {
    calculateTotalPrice(cart);
  }, [cart]);

  // Calculate the total price based on cart items
  const calculateTotalPrice = (cartItems: CartProduct[]) => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalPrice(totalPrice);
  };

  // Handle quantity change for a specific cart item
  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    const cartItemToUpdate = cart.find(item => item.cartItemId === cartItemId);
  
    if (!cartItemToUpdate) {
      console.error(`Cart item with ID ${cartItemId} not found.`);
      return;
    }
  
    let updatedCart: CartProduct[] = [...cart]; 
  
    if (newQuantity <= 0) {
      updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
      setCart(updatedCart);
      // Remove the cart item from the database or update it accordingly
    } else {
      updatedCart = cart.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCart(updatedCart);
      // Update the cart item in the database
    }
  
    // After updating the cart, save it to local storage
    saveCartToLocalStorage(updatedCart);
  };

  // Handle adding a product to the cart
  const handleAddToCart = (product: Product) => {
    const existingCartItem = cart.find(item => item.title === product.title);

    let updatedCart: CartProduct[] = [...cart]; 

    if (existingCartItem) {
      updatedCart = cart.map(item =>
        item.title === existingCartItem.title
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      // Update the existing cart item in the database
    } else {
      const cartItemId = cartItemIdCounter;
      updatedCart = [
        ...cart,
        { ...product, quantity: 1, cartItemId }
      ];
      setCart(updatedCart);
      setCartItemIdCounter(cartItemIdCounter + 1);
      // Add a new cart item to the database
    }

    // After updating the cart, save it to local storage
    saveCartToLocalStorage(updatedCart);
  };

  // Handle sending the cart to the database
  const handleSendCartToDatabase = async () => {
    try {
      await addCartToDatabase(cart, totalPrice);

      console.log('Shopping cart has been sent to the database.');
      setCart([]);
      setTotalPrice(0);
      console.log('Shopping cart has been cleared.');

      // After clearing the cart, also remove it from local storage
      saveCartToLocalStorage([]);
    } catch (error) {
      console.error('An error occurred when sending the shopping cart to the database:', error);
    }
  };

  return (
    <div className="basketpagewrapper">
      <div className="basket-divwrapper">
        <ul className='product-basket-ul'>
          <h2>Products</h2>
          {products.map((product) => (
            <li className='basket-product-list' key={product.id}>
              {product.imgURL.length > 0 && (
                <img src={product.imgURL[0]} alt={`Image 0`} className="basket-product-image" />
              )}
              <div className='basket-info'>
                <div className="basket-info-text">
                  {product.title} - {product.price} SEK
                </div>
                <button className='basket-btn' onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="basket-divwrapper">
        <h2>Shopping Cart</h2>
        <ul className='basket-ul'>
          {cart.map((item) => (
            <li key={item.cartItemId}>
              {item.imgURL.length > 0 && (
                <img src={item.imgURL[0]} alt={`Image 0`} className="basket-image" />
              )}
              <div className='basket-info'>
                <div className="basket-info-text">
                  {item.title} - {item.price} SEK
                </div>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    value={item.quantity ?? 0}
                    onChange={(e) => handleQuantityChange(item.cartItemId, parseInt(e.target.value))}
                  />
                  <button onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}>+</button>
                </div>
                <p>Price: {item.price * item.quantity} SEK</p>
              </div>
            </li>
          ))}
        </ul>

        <p>Total Price: {totalPrice} SEK</p>
        <button className='submit-btn' onClick={handleSendCartToDatabase}>Send Cart to Database</button>
      </div>
    </div>
  );
};

export default BasketComp;
