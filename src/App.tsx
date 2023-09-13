import { Routes, Route } from 'react-router-dom'
import Home from '../src/pages/Home'
import Basket from '../src/pages/Basket'
import Navbar from '../src/components/Navbar'
import AddProduct from '../src/pages/AddProduct'
import Profile from '../src/pages/Profile'
import { AuthProvider } from './auth/AuthContext';

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