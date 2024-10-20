// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js'); // Ensure this line is added

const router = express.Router();

// User registration route
router.post('/register', register);

// User login route
router.post('/login', login);

// Example of a protected route that requires authentication
router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'Protected profile data', user: req.user });
});

module.exports = router;
