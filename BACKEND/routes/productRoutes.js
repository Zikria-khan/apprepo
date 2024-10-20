// routes/productRoutes.js
const express = require('express');
const {
    addProduct,
    deleteProduct,
    getAllProducts,
    updateProduct,
    
    getProductById
} = require('../controllers/productController.js');
const authMiddleware = require('../middleware/authMiddleware.js'); // Authentication middleware

const router = express.Router();

// Route to add product with image upload
router.post('/add', authMiddleware, addProduct);

// Route to delete a product by ID
router.delete('/delete/:id', authMiddleware, deleteProduct);

// Route to get all products
router.get('/', getAllProducts);

// Route to update a product by ID
router.put('/update/:id', authMiddleware, updateProduct);

// Route to get a product by ID
router.get('/:id', getProductById);

// Route to get products by category name

module.exports = router;
