import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext'
import { addProduct } from '../service/productService';
import '../css/AddProductForm.css'

function AddProductForm() {
    const { isLoggedIn } = useAuth();
    const [productData, setProductData] = useState({
        title: '',
        price: 0,
        category: '',
        shortDescription: '',
        imgURL: ['', '', '', '', '']
    });
    const [error, setError] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const newImgURL = [...productData.imgURL];
        newImgURL[index] = event.target.value;
        setProductData({ ...productData, imgURL: newImgURL });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!isLoggedIn) { 
            setError('Du måste vara inloggad för att lägga till en produkt.');
            return;
        }

        // Validering av inputfält
        if (
            !productData.title ||
            !productData.price ||
            !productData.category ||
            !productData.shortDescription ||
            productData.imgURL.some(url => !url)
        ) {
            setError('Fyll i alla obligatoriska fält.');
            return;
        }

        try {
            await addProduct(productData); 
            console.log('Skickade produktdata till databasen:', productData);

            setProductData({
                title: '',
                price: 0,
                category: '',
                shortDescription: '',
                imgURL: ['', '', '', '', '']
            });
            setError('');
        } catch (err) {
            setError('Något gick fel när produkten skulle läggas till.');
        }
    };

    return (
<div className="add-product-container">
    <form className="add-product-form" onSubmit={handleSubmit}>
        <h1>Lägg till produkt</h1>
    {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='wrapper'>
            <div className="column1wrapper">
        <div className="input-wrapper">
            <label>
                Titel:
            </label>
            <input
                type="text"
                name="title"
                value={productData.title}
                onChange={handleInputChange}
            />
        </div>
        <div className="input-wrapper">
            <label>
                Pris:
            </label>
            <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
            />
        </div>
        <div className="input-wrapper">
            <label>
                Kategori:
            </label>
            <input
                type="text"
                name="category"
                value={productData.category}
                onChange={handleInputChange}
            />
        </div>
        <div className="input-wrapper">
            <label>
                Kort beskrivning:
            </label>
            <input
                type="text"
                name="shortDescription"
                value={productData.shortDescription}
                onChange={handleInputChange}
            />
        </div>
        </div>
        <div className="column1wrapper">
        {productData.imgURL.map((url, index) => (
            <div className="input-wrapper" key={index}>
                <label>
                    Bild {index + 1} URL:
                </label>
                <input
                    type="text"
                    value={url}
                    onChange={(event) => handleImageChange(event, index)}
                />
            </div>
            
        ))}
        </div>
        </div>
        <button type="submit">Lägg till produkt</button>
    </form>
</div>

    );
}

export default AddProductForm;