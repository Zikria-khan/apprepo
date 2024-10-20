const Product = require('../models/productModel'); // Adjust the path as necessary
const Order = require('../models/orderModel'); // Adjust the path as necessary

// Add product to cart
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body; // Extract productId and quantity from the request body
    const userId = req.user.id; // Extract userId from the authenticated user (ensure this is populated by your authentication middleware)

    console.log(req.body, userId, " addtocart");

    // Ensure the productId and quantity are present
    if (!productId || !quantity || !userId) {
        return res.status(400).json({ message: 'Product ID, quantity, and user ID are required' });
    }

    try {
        // Find the user's cart
        let cart = await Order.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            const newCart = new Order({ user: userId, products: [] }); // Ensure 'user' field is populated
            await newCart.save();
            cart = newCart; // Assign new cart to cart variable
        }

        // Find the product in the cart
        const existingItem = cart.products.find(item => item.product.toString() === productId);

        if (existingItem) {
            // If the item already exists, update the quantity
            existingItem.quantity += quantity;
        } else {
            // If it's a new item, add it to the cart
            cart.products.push({ product: productId, quantity }); // Use 'product' instead of 'productId'
        }

        await cart.save(); // Save the updated cart

        return res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    try {
        const cart = await Order.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the product from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        await cart.save();
        return res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Process payment
const processPayment = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Order.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Dummy payment processing
        const paymentSuccess = true;

        if (paymentSuccess) {
            // Create a new order
            const order = new Order({
                user: userId,
                products: cart.items.map(item => ({
                    product: item.productId._id,
                    quantity: item.quantity,
                })),
                totalAmount: cart.items.reduce((total, item) => total + item.productId.price * item.quantity, 0),
                status: 'Pending',
            });

            await order.save();

            // Clear the cart after successful payment
            cart.items = [];
            await cart.save();

            return res.status(200).json({ message: 'Payment successful', order });
        } else {
            return res.status(400).json({ message: 'Payment failed' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        return res.status(500).json({ message: 'Error processing payment', error });
    }
};

// Controller to add a new product
const addProduct = async (req, res) => {
    const productData = req.body;

    try {
        const newProduct = new Product(productData);
        await newProduct.save();
        return res.status(201).json({ message: 'Product added successfully', newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to delete a product by ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to update a product by ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to get a product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//const Product = require('../models/productModel'); // Ensure you import the Product model

// Controller to get products by category name



// Controller to get all products
const getAllProducts = async (req, res) => {
    try {
        const { categories } = req.query; // Get the categories from the query parameters
        let products;
            console.log(categories)
        if (categories) {
            // Fetch products that match the category
            products = await Product.find({ categories: categories });
            console.log(products)
        } else {
            // Fetch all products if no category is specified
            products = await Product.find();
        }

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        return res.status(200).json(products); // Return the products in the response
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Export all controllers together
// Export all controllers together
module.exports = {
    addToCart,
    removeFromCart,
    processPayment,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    getAllProducts // Ensure this line ends with a comma if there are more exports
};
