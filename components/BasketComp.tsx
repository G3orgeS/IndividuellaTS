import React, { useState, useEffect } from 'react';
import { fetchProducts, Product } from '../service/productService';
import { fetchCartItems, addCartItem, removeCartItem, updateCartItem } from '../service/cartService';

export interface CartProduct extends Product {
  quantity: number;
  cartItemId: number;
}

const BasketComp = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cartItemIdCounter, setCartItemIdCounter] = useState<number>(1); // Initialize the counter

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
      // Handle the case where the cart item is not found
      console.error(`Cart item with ID ${cartItemId} not found.`);
      return;
    }
  
    if (newQuantity <= 0) {
      const updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
      setCart(updatedCart);
      removeCartItem(cartItemId); // Ta bort produkten från databasen
    } else {
      const updatedCart = cart.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCart(updatedCart);
      updateCartItem({ ...cartItemToUpdate, quantity: newQuantity }); // Uppdatera produkten i databasen
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
      updateCartItem(existingCartItem); // Uppdatera produkten i databasen
    } else {
      const cartItemId = cartItemIdCounter;
      const updatedCart = [
        ...cart,
        { ...product, quantity: 1, cartItemId }
      ];

      setCart(updatedCart);
      setCartItemIdCounter(cartItemIdCounter + 1);
      addCartItem({ ...product, quantity: 1, cartItemId }); // Lägg till produkten i databasen
    }
  };

// lägg till local storage currentCart. spara kundkorgen ifall jag skulle ladda om sidan. 

  const handleSendCartToDatabase = async () => {
    try {
      // Skicka hela kundkorgen till databasen
      await Promise.all(cart.map((cartItem) => updateCartItem(cartItem)));
      console.log('Kundkorgen har skickats till databasen.');
  
      // Töm kundkorgen
      setCart([]);
      setTotalPrice(0); // Återställ totalpriset till noll
      console.log('Kundkorgen har tömts.');
    } catch (error) {
      console.error('Det uppstod ett fel när kundkorgen skulle skickas till databasen:', error);
    }
  };
  
  

  return (
    <div>
      <h2>Produkter</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - {product.price}
            <button onClick={() => {
              console.log("Product to be added:", product);
              handleAddToCart(product);
            }}>Lägg till i kundkorg</button>
          </li>
        ))}
      </ul>

      <h2>Kundkorg</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.cartItemId}>
            {item.title} - {item.price} SEK
            <input
              type="number"
              value={item.quantity ?? 0}
              onChange={(e) => handleQuantityChange(item.cartItemId, parseInt(e.target.value))}
            />
            <p>Pris: {item.price * item.quantity} SEK</p> {/* Visa priset för produkten * kvantitet */}
          </li>
        ))}
      </ul>

      <p>Totalt pris: {totalPrice} SEK</p>
      <button onClick={handleSendCartToDatabase}>Skicka kundkorgen till databasen</button>

    </div>
  );
};

export default BasketComp;
