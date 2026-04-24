import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = process.env.REACT_APP_API_URL;



const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [allProperties, setAllProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [sortOption, setSortOption] = useState('');

  const instructionSliderRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 🔥 Load user from localStorage instead of /api/me
  useEffect(() => {
    if (!token) {
      toast.error('Please login to continue.');
      navigate('/login');
      return;
    }

    const storedUserString = localStorage.getItem('user');
if (storedUserString) {
  try {
    const storedUser = JSON.parse(storedUserString);
    setUser(storedUser);
  } catch (err) {
    console.error("Invalid user JSON:", err);
    localStorage.removeItem('user'); // optional: clean corrupted data
    toast.error('Corrupted user data. Please login again.');
    navigate('/login');
  }
} else {
  toast.error('Session expired. Please login again.');
  navigate('/login');
}

  }, [token, navigate]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          const propertyIds = data.map((item) => item._id);
          setWishlist(propertyIds);
        } else {
          toast.error('Failed to fetch wishlist');
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        toast.error('Could not load wishlist');
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user, token]);
 console.log(user);
  useEffect(() => {
    const slider = instructionSliderRef.current;
    const scrollAmount = 260;
    let autoScroll = setInterval(() => {
      if (!slider) return;
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(autoScroll);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/properties`);
        const data = await response.json();
        setAllProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties.');
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  const toggleWishlist = async (_id) => {
    try {
      const res = await fetch(`${apiUrl}/api/wishlist/${_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setWishlist((prev) =>
          prev.includes(_id)
            ? prev.filter((item) => item !== _id)
            : [...prev, _id]
        );
      } else {
        toast.error('Failed to update wishlist');
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      toast.error('Something went wrong');
    }
  };

  const filteredProperties = Array.isArray(allProperties)
    ? allProperties.filter((property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.price?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    if (priceString.toLowerCase().includes('cr')) {
      return parseFloat(cleaned) * 10000000;
    } else if (priceString.toLowerCase().includes('lakh') || priceString.toLowerCase().includes('lac')) {
      return parseFloat(cleaned) * 100000;
    } else {
      return parseFloat(cleaned);
    }
  };

  const sortedProperties = React.useMemo(() => {
    let sorted = [...filteredProperties];
    if (sortOption === 'Price: Low to High') {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOption === 'Price: High to Low') {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortOption === 'Most Recent') {
      sorted.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }
    return sorted;
  }, [filteredProperties, sortOption]);

  const handleLogout = () => {
    toast.info('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <nav className="top-navbar">
        <div className="navbar-left">
          <button className="hamburger" onClick={toggleSidebar}>☰</button>
          <input
            type="text"
            className="search-input"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
      </nav>

      <div className="main-content">
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          {user ? (
            <>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <button onClick={() => navigate('/your-properties')}>Your Properties</button>
              <button onClick={() => navigate('/upload-property')}>Upload a Property</button>
              <button onClick={()=>navigate('/wishlist')}>Wishlist</button>
              {user.isAdmin === true && (
                <button onClick={() => navigate('/review-properties')}>Review Properties</button>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <p>Guest Mode - Login for more features...</p>
          )}
        </aside>

        <div className="dashboard">
          

          <div className="properties-grid">
            {loadingProperties ? (
              <p>Loading properties...</p>
            ) : sortedProperties.length > 0 ? (
              sortedProperties.map((property) => (
                <div
                  key={property._id}
                  className="property-card"
                  onClick={() =>
                    navigate(`/property/${property._id}`, { state: { property } })
                  }
                >
                  
                  <img
                    src={`${apiUrl}${property.images[0]}`}
                    alt={property.title}
                  />
                  <div className="property-info">
                    <h2>{property.title}</h2>
                    <p>{property.location}</p>
                    <span className="price">{property.price}</span>
                    <button
                      className={`wishlist-btn ${wishlist.includes(property._id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(property._id);
                      }}
                    >
                      ❤️ {wishlist.includes(property._id) ? 'Wishlisted' : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No matching properties found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
