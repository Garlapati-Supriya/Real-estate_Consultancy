import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadProperty.css';

const apiUrl = process.env.REACT_APP_API_URL;

const UploadProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    length: '',
    breadth: '',
    shape: '',
    soilColor: '',
    location: '',
    loanFacility: false,
    description: '',
    ownerName: '',
    ownerPhone: '',
    ownerAadhar: '',
    status: 'Under Review',
    price: '',
  });

  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    setImages([...e.target.files]);
  };

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleDocumentUpload = (e) => {
    setDocuments([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      'title',
      'area',
      'length',
      'breadth',
      'shape',
      'soilColor',
      'location',
      'description',
      'ownerName',
      'ownerPhone',
      'ownerAadhar',
      'price',
    ];

    const emptyField = requiredFields.find((field) => !formData[field]);
    if (emptyField) {
      alert(`❌ Please fill out the '${emptyField}' field.`);
      return;
    }

    if (images.length === 0) {
      alert('❌ Please upload at least one image.');
      return;
    }

    if (!video) {
      alert('❌ Please upload a property video.');
      return;
    }

    if (documents.length === 0) {
      alert('❌ Please upload at least one legal document.');
      return;
    }

    setSubmitted(true);
  };

  useEffect(() => {
    const uploadProperty = async () => {
      if (!submitted) return;

      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ Please log in to upload properties.');
        return;
      }

      const propertyData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        propertyData.append(key, value);
      });

      images.forEach((img) => propertyData.append('images', img));
      if (video) propertyData.append('video', video);
      documents.forEach((doc) => propertyData.append('documents', doc));

      try {
        const response = await fetch(`${apiUrl}/api/properties`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: propertyData,
          credentials: 'include',
        });

        if (response.ok) {
          alert('✅ Property uploaded successfully and is under review.');
          setTimeout(() => navigate('/your-properties'), 1000);
        } else {
          const errorData = await response.json();
          console.error('Failed to upload property:', errorData);
          alert('❌ Upload failed: ' + (errorData.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('❌ An error occurred while uploading the property.');
      } finally {
        setSubmitted(false);
      }
    };

    uploadProperty();
  }, [submitted, formData, images, video, documents, navigate]);

  return (
    <div className="upload-property-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Go Back
      </button>
      <h2>Upload Your Property</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Property Title" onChange={handleChange} required />
        <input name="area" placeholder="Area (sq ft)" onChange={handleChange} required />
        <input name="length" placeholder="Length (ft)" onChange={handleChange} required />
        <input name="breadth" placeholder="Breadth (ft)" onChange={handleChange} required />
        <input name="shape" placeholder="Shape" onChange={handleChange} required />
        <input name="soilColor" placeholder="Soil Color" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <label>
          <input type="checkbox" name="loanFacility" onChange={handleChange} /> Loan Facility Available
        </label>
        <textarea name="description" placeholder="Property Description" onChange={handleChange} required />
        <input name="ownerName" placeholder="Owner Name" onChange={handleChange} required />
        <input name="ownerPhone" placeholder="Owner Phone No" onChange={handleChange} required />
        <input name="ownerAadhar" placeholder="Owner Aadhar No" onChange={handleChange} required />
        <input name="price" placeholder="Price" onChange={handleChange} required />

        <label>Upload Images (multiple):</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        <label>Upload Property Video:</label>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />

        <label>Upload Legal Documents (PDFs):</label>
        <input type="file" multiple accept="application/pdf" onChange={handleDocumentUpload} />

        <button type="submit">Submit Property</button>
      </form>
    </div>
  );
};

export default UploadProperty;
