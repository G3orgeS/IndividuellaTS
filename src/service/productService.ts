import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

export interface Product {
  id?:              string;
  category:         string;
  imgURL:           string[];
  price:            number;
  shortDescription: string;
  title:            string;
  quantity?:        number;
  createdAt:        string; 
}

// Function to fetch products from the Firestore database
async function fetchProducts(): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, 'Products');
    const productsSnapshot = await getDocs(productsCollectionRef);
    const products: Product[] = [];

    productsSnapshot.forEach((doc) => {
      // Get ID from the document
        const productData = doc.data() as Product;
          productData.id = doc.id;
          products.push(productData);
    });
      return products;
    } catch (error) {
        console.error('Error fetching products:', error);
      return [];
    }
}

// Function to fetch products from the Firestore database with sorting by "createdAt" field
async function fetchProductsSortedByCreatedAt(sortOrder: 'asc' | 'desc'): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, 'Products');
    const querySnapshot = await query(
      productsCollectionRef,
      orderBy('createdAt', sortOrder)
    );

    const products: Product[] = [];

    const productDocs = await getDocs(querySnapshot);

    productDocs.forEach((doc) => {
      const productData = doc.data() as Product;
      productData.id = doc.id;
      products.push(productData);
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to add a product to the Firestore database
async function addProduct(product: Product): Promise<void> {
  try {
      const productToAdd = { ...product, createdAt: new Date().toISOString() }; // Lägg till createdAt här om det inte finns
      const productsCollectionRef = collection(db, 'Products');
      await addDoc(productsCollectionRef, productToAdd);
      console.log('Product added successfully!');
  } catch (error) {
      console.error('Error adding product:', error);
  }
}

// Function to delete a product from the Firestore database
async function deleteProduct(productId: string): Promise<void> {
    try {
        const productDocRef = doc(db, 'Products', productId);
        await deleteDoc(productDocRef);
        console.log('Product deleted successfully!');
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

export { fetchProducts, addProduct, deleteProduct, fetchProductsSortedByCreatedAt };