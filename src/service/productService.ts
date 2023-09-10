import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

export interface Product {
    id?:                string;
    category:           string;
    imgURL:             string[];
    price:              number;
    shortDescription:   string;
    title:              string;
    quantity?: number; // Lägg till quantity här
}

async function fetchProducts(): Promise<Product[]> {
    try {
        const productsCollectionRef = collection(db, 'Products');
        const productsSnapshot = await getDocs(productsCollectionRef);
        const products: Product[] = [];
        productsSnapshot.forEach((doc) => {
            // Hämta ID från dokumentet
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

async function addProduct(product: Product): Promise<void> {
    try {
        const productsCollectionRef = collection(db, 'Products');
        // console.log('Before addDoc');
        addDoc(productsCollectionRef, product);
        // console.log(productsCollectionRef, product)
        // console.log('After addDoc');
        // console.log('Product added successfully!');
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function deleteProduct(productId: string): Promise<void> {
    try {
      const productDocRef = doc(db, 'Products', productId);
      await deleteDoc(productDocRef);
      console.log('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
  


export { fetchProducts, addProduct, deleteProduct };
