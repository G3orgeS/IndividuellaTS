import { db } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export interface Product {
    category: string;
    imgURL: string[];  
    price: number;
    shortDescription: string;
    title: string;
}

async function fetchProducts(): Promise<Product[]> {
    try {
        const productsCollectionRef = collection(db, 'Products');
        const productsSnapshot = await getDocs(productsCollectionRef);
        const products: Product[] = [];
        productsSnapshot.forEach((doc) => {
            products.push(doc.data() as Product);
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
        console.log('Before addDoc');
        addDoc(productsCollectionRef, product);
        console.log(productsCollectionRef, product)
        console.log('After addDoc');
        console.log('Product added successfully!');
    } catch (error) {
        console.error('Error adding product:', error);
    }
}


export { fetchProducts, addProduct };
