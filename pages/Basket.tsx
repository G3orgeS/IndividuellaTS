import React from 'react';
import BasketComp from '../components/BasketComp';
import { fetchProducts } from '../service/productService'

function Basket() {
  return (
    <div>
      <h1>Min Kundkorg</h1>
      <BasketComp />
    </div>
  );
}

export default Basket;
