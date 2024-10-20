import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AllProducts.css'; // Ensure your CSS file path is correct

const AllProducts = ({ products }) => {
    // Ensure products is defined and an array
    console.log('Products passed to AllProducts:', products); // Debugging log
    const [quantities, setQuantities] = useState({}); // State to manage quantities

    const handleQuantityChange = (productId, quantity) => {
        setQuantities((prev) => ({ ...prev, [productId]: quantity }));
    };

    const addToCart = async (productId) => {
        const quantity = quantities[productId] || 1; // Default to 1 if no quantity is set

        // Validate quantity
        if (quantity <= 0) {
            alert('Please select a valid quantity');
            return;
        }

        // Get token and userId from localStorage
        const token = localStorage.getItem('token'); // Replace 'token' with your actual key for the token
        const userId = localStorage.getItem('userId'); // Replace 'userId' with your actual key for the user ID
        console.log(token,"token")
        if (!token || !userId) {
            alert('You need to be logged in to add items to the cart.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Use the token here
                },
                body: JSON.stringify({ productId, quantity, userId }), // Include userId in the request body
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Success message
            } else {
                alert(data.message || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding to the cart.');
        }
    };

    if (!Array.isArray(products) || products.length === 0) {
        return <p>No products available</p>; // Show a message if products is not an array or empty
    }

    return (
        <div className="products-grid">
            {products.map((product) => (
                <div key={product._id} className="product-card"> {/* Use _id instead of id */}
                    <img src={product.image} alt={product.name} />
                    <h2>{product.name}</h2>
                    <p>${product.price}</p>
                    <input
                        type="number"
                        min="1"
                        defaultValue="1"
                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                        className="quantity-input"
                    />
                    <div className="product-buttons">
                        <Link to={`/product/${product._id}`} className="view-details-btn">
                            View Details
                        </Link>
                        <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AllProducts;
