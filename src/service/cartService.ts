import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { CartProduct } from '../components/BasketComp';

const cartRef = 'cart';

// Add a cart item to Firestore
async function addCartItem(cartItem: CartProduct): Promise<void> {
  try {
    await addDoc(collection(db, cartRef), cartItem);
  } catch (error) {
    console.error('Error adding cart item:', error);
  }
}

// Add the whole cart to the database
const addCartToDatabase = async (cartItems: CartProduct[], total: number): Promise<void> => {
  try {
    // Create a unique ID for the cart
    const cartDate = new Date().toISOString();

    // Create an object representing the entire cart
    const cartData = {
      cartDate,
      cartItems,
      total,
    };

    // Add the entire cart as an object in Firestore
    await addDoc(collection(db, cartRef), cartData);
  } catch (error) {
    console.error('Error adding cart to database:', error);
  }
};

export { addCartItem, addCartToDatabase };

// Remove a cart item from Firestore
// const removeCartItem = async (cartItemId: number): Promise<void> => {
//   try {
//     const cartItemQuery = query(collection(db, CART_COLLECTION), where('cartItemId', '==', cartItemId));
//     const querySnapshot = await getDocs(cartItemQuery);

//     if (!querySnapshot.empty) {
//       const docId = querySnapshot.docs[0].id;
//       await deleteDoc(doc(db, CART_COLLECTION, docId));
//     }
//   } catch (error) {
//     console.error('Error removing cart item:', error);
//   }
// };

// Update a cart item in Firestore
// const updateCartItem = async (cartItem: CartProduct): Promise<void> => {
//   try {
//     const cartItemQuery = query(collection(db, CART_COLLECTION), where('cartItemId', '==', cartItem.cartItemId));
//     const querySnapshot = await getDocs(cartItemQuery);

//     if (!querySnapshot.empty) {
//       const docId = querySnapshot.docs[0].id;
//       await setDoc(doc(db, CART_COLLECTION, docId), cartItem);
//     }
//   } catch (error) {
//     console.error('Error updating cart item:', error);
//   }
// };