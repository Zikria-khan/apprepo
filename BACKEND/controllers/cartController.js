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
    const userId = req.user._id; // Assuming user is authenticated

    try {
        // Find cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove item from the cart
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Update cart total
        cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await cart.save();

        return res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing from cart', error });
    }
};

// Cart total and checkout process
const processPayment = async (req, res) => {
    const userId = req.user._id;

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Perform payment processing (dummy process here)
        // In real scenario, you would integrate with a payment gateway (e.g., Stripe, PayPal)
        const paymentSuccess = true; // Assume payment is successful for now

        if (paymentSuccess) {
            // Create a new order
            const order = new Order({
                user: userId,
                products: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                })),
                totalAmount: cart.total,
                status: 'Pending'
            });

            await order.save();

            // Clear the cart after payment is successful
            cart.items = [];
            cart.total = 0;
            await cart.save();

            return res.status(200).json({ message: 'Payment processed successfully', order });
        } else {
            return res.status(400).json({ message: 'Payment failed' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error processing payment', error });
    }
};

// Get all products

// Get all cart items for a specific user
const getCartItems = async (req, res) => {
    try {
    console.log(req.body ,'req')

        const userId = req.user.id; // Get user ID from the authenticated user
        const cart = await Order.findOne({ user: userId }).populate('products.product'); // Find the user's cart and populate product details
  if(!cart){
    return res.status(200).json({ message: 'Cart is empty.', products: [] }); // Return an empty cart message

  }
            
        if (cart.products.length === 0  ) {
            return res.status(200).json({ message: 'Cart is empty.', products: [] }); // Return an empty cart message
        }

        return res.status(200).json(cart.products); // Return the populated products in the cart
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};







module.exports = {
    addToCart,
    removeFromCart,
    processPayment,
    getCartItems, // Export the new function
};



