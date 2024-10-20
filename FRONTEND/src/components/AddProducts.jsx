import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const AddProducts = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const [quantity, setQuantity] = useState(1); // New state for quantity
    const [loading, setLoading] = useState(false);

    const uploadImageToCloudinary = async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'zakriya');

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dtuhnl2sa/image/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.secure_url; // Returns the secure URL of the uploaded image
        } catch (error) {
            console.error('Cloudinary upload error:', error.response ? error.response.data : error);
            toast.error('Image upload failed! Please check the console for details.');
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload the image to Cloudinary
            let imageUrl;
            if (image) {
                imageUrl = await uploadImageToCloudinary(image);
            } else {
                toast.warn('No image selected!'); // Warn if no image is selected
            }

            const formData = {
                name,
                price,
                description,
                categories,
                stock,
                image: imageUrl, // Use the Cloudinary URL if available
                quantity // Add quantity to formData
            };

            // Get the token from local storage
            const token = localStorage.getItem('token');

            // Send the product details to your API
            const response = await axios.post('http://localhost:8000/api/products/add', formData, {
                headers: {
                    'Authorization': `Bearer ${token}` // Add the token to the headers
                },
            });

            console.log('Product added:', response.data);
            toast.success('Product added successfully!'); // Success toast
            
            // Reset form fields
            setName('');
            setPrice('');
            setDescription('');
            setCategories('');
            setStock('');
            setImage(null);
            setQuantity(1); // Reset quantity to 1
        } catch (error) {
            console.error('Error adding product:', error.response?.data || error.message);
            toast.error('Error adding product! Please try again.'); // Error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Add New Product</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.inputField}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={styles.inputField}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{ ...styles.inputField, ...styles.textArea }}
                />
                <input
                    type="text"
                    placeholder="Categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    required
                    style={styles.inputField}
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    style={styles.inputField}
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={styles.inputField}
                    required // Make this required if you need an image
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1" // Prevents adding zero or negative quantities
                    required
                    style={styles.inputField}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputField: {
        marginBottom: '1rem',
        padding: '0.8rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
    },
    textArea: {
        height: '100px',
    },
    button: {
        padding: '0.8rem',
        backgroundColor: '#ff4081', // Myntra pink color
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default AddProducts;
