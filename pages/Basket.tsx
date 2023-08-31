import React from 'react';
import ProductList from '../components/ProductList';
import BasketComp from '../components/BasketComp'
import '../css/Basket.css'

function Basket() {
    return (
        <div className='basketpagewrapper'>
            <ProductList isModalEnabled={false}/>
            <BasketComp />
        </div>
    );
}

export default Basket;