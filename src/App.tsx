import { Routes, Route } from 'react-router-dom'
// import React from 'react';
import Home from '../src/pages/Home'
// import ProductDetail from '../pages/ProductDetail'
import Basket from '../src/pages/Basket'
import Navbar from '../src/components/Navbar'
import AddProduct from '../src/pages/AddProduct'
import Profile from '../src/pages/Profile'
// import { db } from './firebase/config'
import { AuthProvider } from '../auth/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/basket' element={<Basket />} />
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
