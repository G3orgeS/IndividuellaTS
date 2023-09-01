import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { CartProduct } from '../components/BasketComp';

const CART_COLLECTION = 'carts';

// Fetch the user's cart items from Firestore
export const fetchCartItems = async (): Promise<CartProduct[]> => {
  const cartItems: CartProduct[] = [];

  try {
    const querySnapshot = await getDocs(collection(db, CART_COLLECTION));

    querySnapshot.forEach((doc) => {
      const cartItem = doc.data() as CartProduct;
      cartItems.push(cartItem);
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }

  return cartItems;
};

// Add a cart item to Firestore
export const addCartItem = async (cartItem: CartProduct): Promise<void> => {
  try {
    await addDoc(collection(db, CART_COLLECTION), cartItem);
  } catch (error) {
    console.error('Error adding cart item:', error);
  }
};

// Remove a cart item from Firestore
export const removeCartItem = async (cartItemId: number): Promise<void> => {
  try {
    const cartItemQuery = query(collection(db, CART_COLLECTION), where('cartItemId', '==', cartItemId));
    const querySnapshot = await getDocs(cartItemQuery);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, CART_COLLECTION, docId));
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
  }
};

// Update a cart item in Firestore
export const updateCartItem = async (cartItem: CartProduct): Promise<void> => {
  try {
    const cartItemQuery = query(collection(db, CART_COLLECTION), where('cartItemId', '==', cartItem.cartItemId));
    const querySnapshot = await getDocs(cartItemQuery);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await setDoc(doc(db, CART_COLLECTION, docId), cartItem);
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
};

// Add the whole cart to the database
export const addCartToDatabase = async (cartItems: CartProduct[], total: number): Promise<void> => {
  try {
    // Create a unique ID for the cart
    const cartId = new Date().toISOString();

    // Create an object representing the entire cart
    const cartData = {
      cartId,
      cartItems,
      total,
    };

    // Add the entire cart as an object in Firestore
    await addDoc(collection(db, CART_COLLECTION), cartData);
  } catch (error) {
    console.error('Error adding cart to database:', error);
  }
};
