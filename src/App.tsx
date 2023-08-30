import { Routes, Route } from 'react-router-dom'
import React from 'react';
import Home from '../pages/Home'
// import ProductDetail from '../pages/ProductDetail'
import Basket from '../pages/Basket'
import Navbar from '../components/Navbar'
import AddProduct from '../pages/AddProduct'
import Profile from '../pages/Profile'
import { db } from '../firebase/config'
import { AuthProvider } from '../auth/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/productdetail:id' element={<ProductDetail />} /> */}
        <Route path='/basket' element={<Basket />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
  // console.log(db)
}

export default App;
