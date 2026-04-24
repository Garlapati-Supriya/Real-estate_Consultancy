import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './ReviewProperties.css';
const apiUrl = process.env.REACT_APP_API_URL;

const ReviewProperties = () => {
  const [properties, setProperties] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
       const token = localStorage.getItem('token'); // ✅ Get JWT token

    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
    
        const fetchProperties = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/review-properties`,{
          method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in headers
          'Content-Type': 'application/json'
        }
        });
const data = await response.json();

console.log("API Response:", data); // DEBUG

if (Array.isArray(data)) {
  setProperties(data);
} else if (Array.isArray(data.properties)) {
  setProperties(data.properties);
} else {
  setProperties([]); // fallback
}
      } catch (error) {
        console.error('Error fetching properties:', error);
      } 
    };

    fetchProperties();
  }, []);

  const handleModify=(product)=>{
         navigate(`/approve-property/${product._id}`,{state:{product}});
  }

  return (
    <div className='product-page'>
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
    ← Back to Dashboard
     </button>
      {properties.map(product => (
        <div className="product-card" key={product._id}>
          <img src={`${apiUrl}${product.images[0]}`} alt={product.title} className="product-image" />
          <div className="product-details">
            <h2 className="product-title">{product.title}</h2>
            <p> <strong>Price :</strong> {product.price}</p>
            <p><strong>Location :</strong>{product.location}</p>
            <div className="product-actions">
              <button className="buy-btn" onClick={()=>handleModify(product)}>Click here to Approve/Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewProperties;
