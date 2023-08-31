import React from 'react';
import ProductList from '../components/ProductList'
import '../css/Home.css'

function Home() {
    return (
        <div>
            {/* <h1>Home</h1> */}
            <ProductList isModalEnabled={true}/>
        </div>
    );
}

export default Home;
