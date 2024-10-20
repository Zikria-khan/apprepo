import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link for navigation
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const DetailProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL parameters
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/products/${id}`);
            const data = await response.json();
            console.log(data, "detail");
            if (response.ok) {
                setProduct(data.product); // Access the product object here
            } else {
                toast.error(data.message || "Failed to fetch product details.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching product details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>; // Loading state while fetching product details
    }

    if (!product) {
        return <div className="not-found">Product not found.</div>; // Handle case where product is not found
    }

    return (
        <div className="detail-product">
            <Link to="/" className="back-link">Back to Home</Link> {/* Link to go back to Home */}
            <div className="product-content">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">${product.price}</p>
                    <p className="product-stock">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                    <button className="add-to-cart">Add to Cart</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DetailProduct;
