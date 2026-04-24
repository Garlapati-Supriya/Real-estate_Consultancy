import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import MainComponent from './components/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import DashboardPage from './components/DashboardPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import UploadProperty from './components/UploadProperty';
import YourPropertiesPage from './components/YourPropertiesPage';
import EditPropertyPage from './components/EditPropertyPage';
import WishlistPage from './components/WishlistPage';
import AdminLogin from './components/Adminlogin';
import ReviewProperties from './components/ReviewProperties';
import Approve from './components/Approve';
import Chatbot from './components/Chatbot';
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <Router>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Navbar>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<MainComponent/>}/>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/property/:id" element={<ProductDetailsPage />} />
      <Route path="/upload-property/" element={<UploadProperty />} />
      <Route path="/your-properties" element={<YourPropertiesPage />} />
<Route path="/edit-property/:id" element={<EditPropertyPage />} />  
<Route path="/wishlist" element={<WishlistPage />} />
<Route path="/review-properties" element={<ReviewProperties/>} />
<Route path="/approve-property/:id" element={<Approve/>}/>




    {/*<Route path="/products/:id" element={<ProductDetailPage />} />*/}
    </Routes>
    <Chatbot />  
  </Router>
    
  );
}

export default App;
