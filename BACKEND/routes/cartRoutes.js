const express = require('express');
const { addToCart, removeFromCart, getCartItems } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const stripe = require('../config/stripeConfig'); // Import your Stripe configuration

const router = express.Router();

// Use middleware for authentication
router.use(authMiddleware);

// Route to add a product to the cart
router.post('/add', addToCart);

// Route to remove a product from the cart
router.post('/remove', removeFromCart);

// Route to process payment and create a payment intent
router.post('/checkout', async (req, res) => {
    const userId = req.user._id; // Get the authenticated user's ID
    const { items } = req.body; // Expect items from the frontend

    try {
        // Calculate total amount
        const totalAmount = items.reduce((total, item) => total + item.quantity * item.product.price, 0);

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Amount in cents
            currency: 'usd',
            payment_method_types: ['card'], // Specify payment method types
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating Stripe payment:', error);
        res.status(500).json({ message: 'Error creating payment' });
    }
});

// Route to get all cart items for a user
router.post('/', getCartItems);

module.exports = router;
