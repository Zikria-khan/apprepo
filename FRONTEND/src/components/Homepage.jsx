import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AllProducts from './AllProducts'; // Import the AllProducts component
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './HomePage.css'; 

const images = [
  '/slide1.avif',
  '/slide2.avif',
  '/slide3.avif',
  '/slide4.avif',
];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Shirts'); // Initial category is 'Shirts'
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products by selected category from the backend API
  const fetchProductsByCategory = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await fetch(`http://localhost:8000/api/products/?categories=${selectedCategory}`); // Use selectedCategory in the URL
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log(data); // Log the fetched data to inspect its structure
      setProducts(data); // Assuming the response is an array of products
    } catch (error) {
      console.error(error);
      toast.error('Error loading products');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  
  // Fetch products when the selected category changes
  useEffect(() => {
    fetchProductsByCategory();
  }, [selectedCategory]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <nav className="nav-bar">
        <img src="/logo.webp" alt="Logo" className="logo" />
        <ul className="nav-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/cart" className="nav-link">Cart</Link></li>
          <li><Link to="/login" className="nav-link">Login</Link></li>
          <li><Link to="/register" className="nav-link">Register</Link></li>
        </ul>
      </nav>

      <div className="slider-container">
        <img src={images[currentIndex]} alt={`Slider ${currentIndex + 1}`} className="slider-image" />
        <button onClick={handlePrev} className="slider-arrow left">&#10094;</button>
        <button onClick={handleNext} className="slider-arrow right">&#10095;</button>
      </div>

      <h1 className="section-title">Trending Products</h1>

      {/* Category Selector */}
      <div className='category'>
        <button onClick={() => setSelectedCategory("Shirts")}>Shirts</button>
        <button onClick={() => setSelectedCategory("Pants")}>Pants</button>
        <button onClick={() => setSelectedCategory("Shoes")}>Shoes</button>
      </div>

      {/* Pass the filtered products to the AllProducts component */}
      {isLoading ? <p>Loading products...</p> : <AllProducts products={products} />}

      <footer className="footer">
        <div className="footer-content">
          <img src="/logo.webp" alt="Logo" className="footer-logo" />
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/add-product" className="footer-link">Add Product</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer />
    </>
  );
};

export default HomePage;
