import React, { useState, useEffect } from 'react';
import { fetchProducts, Product } from '../service/productService';
import { fetchCartItems, addCartItem, removeCartItem, updateCartItem } from '../service/cartService';
import '../css/Basket.css'

export interface CartProduct extends Product {
  quantity: number;
  cartItemId: number;
}

const BasketComp = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cartItemIdCounter, setCartItemIdCounter] = useState<number>(1);

  useEffect(() => {
    async function fetchAndSetProducts() {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    }
    fetchAndSetProducts();
  }, []);

  useEffect(() => {
    calculateTotalPrice(cart);
  }, [cart]);

  const calculateTotalPrice = (cartItems: CartProduct[]) => {
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(totalPrice);
  };

  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    const cartItemToUpdate = cart.find(item => item.cartItemId === cartItemId);

    if (!cartItemToUpdate) {
      console.error(`Cart item with ID ${cartItemId} not found.`);
      return;
    }

    if (newQuantity <= 0) {
      const updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
      setCart(updatedCart);
      removeCartItem(cartItemId);
    } else {
      const updatedCart = cart.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCart(updatedCart);
      updateCartItem({ ...cartItemToUpdate, quantity: newQuantity });
    }
  };

  const handleAddToCart = (product: Product) => {
    const existingCartItem = cart.find(item => item.title === product.title);

    if (existingCartItem) {
      const updatedCart = cart.map(item =>
        item.title === existingCartItem.title
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setCart(updatedCart);
      updateCartItem(existingCartItem);
    } else {
      const cartItemId = cartItemIdCounter;
      const updatedCart = [
        ...cart,
        { ...product, quantity: 1, cartItemId }
      ];

      setCart(updatedCart);
      setCartItemIdCounter(cartItemIdCounter + 1);
      addCartItem({ ...product, quantity: 1, cartItemId });
    }
  };

  const handleSendCartToDatabase = async () => {
    try {
      await Promise.all(cart.map((cartItem) => updateCartItem(cartItem)));
      console.log('Kundkorgen har skickats till databasen.');

      setCart([]);
      setTotalPrice(0);
      console.log('Kundkorgen har tömts.');
    } catch (error) {
      console.error('Det uppstod ett fel när kundkorgen skulle skickas till databasen:', error);
    }
  };

  return (
    <div className="basketpagewrapper">
      <div className="basket-divwrapper">
        <ul className='product-basket-ul'>
        <h2>Produkter</h2>
          {products.map((product) => (
            <li className='basket-product-list' key={product.id}>
              {product.imgURL.length > 0 && (
                <img src={product.imgURL[0]} alt={`Image 0`} className="basket-product-image" />
              )}
              <div className='basket-info'>
                <div className="basket-info-text">
              {product.title} - {product.price}kr
              </div>
              <button className='basket-btn' onClick={() => handleAddToCart(product)}>Lägg till i kundkorg</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="basket-divwrapper">
      <h2>Kundkorg</h2>
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
              <p>Pris: {item.price * item.quantity} SEK</p>
            </div>
          </li>
        ))}
      </ul>

        <p>Totalt pris: {totalPrice} SEK</p>
        <button className='submit-btn' onClick={handleSendCartToDatabase}>Skicka kundkorgen till databasen</button>
      </div>
    </div>
  );
};

export default BasketComp;
