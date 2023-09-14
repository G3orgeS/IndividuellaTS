import { useState, ChangeEvent, FormEvent } from 'react';
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
        imgURL: ['', '', '', '', ''],
        createdAt: new Date().toISOString()
    });
    const [error, setError] = useState('');

    // Handle input field changes
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };

    // Handle image URL changes
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const newImgURL = [...productData.imgURL];
        newImgURL[index] = event.target.value;
        setProductData({ ...productData, imgURL: newImgURL });
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!isLoggedIn) { 
            setError('You must be logged in to add a product.');
            return;
        }

        // Input field validation
        if (
            !productData.title ||
            !productData.price ||
            !productData.category ||
            !productData.shortDescription ||
            productData.imgURL.some(url => !url)
        ) {
            setError('Fill in all fields.');
            return;
        }

        try {
            await addProduct(productData); 
            console.log('Sent product data to the database:', productData);

            // Reset the form data
            setProductData({
                title: '',
                price: 0,
                category: '',
                shortDescription: '',
                imgURL: ['', '', '', '', ''],
                createdAt: ''
            });
            setError('');
        } catch (err) {
            setError('Something went wrong when adding the product.');
        }
    };

    return (
        <div className="add-product-container">
            <form className="add-product-form" onSubmit={handleSubmit}>
                <h1>Add Product</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className='wrapper'>
                    <div className="column1wrapper">
                        <div className="input-wrapper">
                            <div>
                                Title:
                            </div>
                            <input
                                type="text"
                                id='title'
                                name="title"
                                value={productData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-wrapper">
                            <div>
                                Price:
                            </div>
                            <input
                                type="number"
                                name="price"
                                value={productData.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-wrapper">
                            <div>
                                Category:
                            </div>
                            <input
                                type="text"
                                name="category"
                                value={productData.category}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-wrapper">
                            <div>
                                Short Description:
                            </div>
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
                                <div>
                                    Image {index + 1} URL:
                                </div>
                                <input
                                    type="text"
                                    id={`imgURL${index}`} 
                                    name={`imgURL${index}`} 
                                    value={url}
                                    onChange={(event) => handleImageChange(event, index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default AddProductForm;
