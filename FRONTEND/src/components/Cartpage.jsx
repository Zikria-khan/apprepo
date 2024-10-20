import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CartPage.css';
const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                const message = 'You need to be logged in to view the cart.';
                setError(message);
                toast.error(message);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/api/cart`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                });

                const data = await response.json();

                if (response.ok) {
                    setCartItems(data);
                    if (data.length === 0) {
                        toast.info('Your cart is empty!');
                    } else {
                        toast.success('Cart items fetched successfully!');
                    }
                } else {
                    const message = data.message || 'Failed to fetch cart items';
                    setError(message);
                    toast.error(message);
                    setCartItems([]);
                }
            } catch (error) {
                const message = 'An error occurred while fetching cart items.';
                setError(message);
                setCartItems([]);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemoveItem = async (productId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/api/cart/remove`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            const data = await response.json();

            if (response.ok) {
                setCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId));
                toast.success('Item removed successfully!');
            } else {
                toast.error(data.message || 'Failed to remove item from cart.');
            }
        } catch (error) {
            toast.error('An error occurred while removing the item.');
        }
    };

    const handleCheckout = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const items = cartItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
        }));

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8000/api/cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to initiate checkout');
            }

            const { clientSecret } = await response.json();

            const cardElement = elements.getElement(CardElement);

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Zakriya Khan', 
                    },
                },
            });

            if (error) {
                toast.error('Payment failed: ' + error.message);
            } else if (paymentIntent.status === 'succeeded') {
                toast.success('Payment successful!');
                setCartItems([]);
            }
        } catch (error) {
            toast.error('Error during checkout: ' + error.message);
        }
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0).toFixed(2);

    const cardOptions = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                fontWeight: '400',
                lineHeight: '24px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    return (
        <div className="cart-container">
            <h1><FontAwesomeIcon icon={faShoppingCart} /> Your Cart</h1>
            {loading ? (
                <div>Loading...</div>
            ) : cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h2>Your cart is empty!</h2>
                    <p>Add items to your cart to get started.</p>
                    <a href="/" className="back-home-link">Back to Home</a>
                </div>
            ) : (
                <>
                    <ul className="cart-item-list">
                        {cartItems.map(item => (
                            <li key={item.product._id} className="cart-item">
                                <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <div>
                                        <h2 className="cart-item-title">{item.product.name}</h2>
                                        <p className="cart-item-price">${(item.product.price * item.quantity).toFixed(2)}</p>
                                        <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                                    </div>
                                    <button className="btn-remove" onClick={() => handleRemoveItem(item.product._id)}>
                                        <FontAwesomeIcon icon={faTrashAlt} /> Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-summary">
                        <p className="cart-total">Total: ${totalAmount}</p>
                        <form onSubmit={handleCheckout}>
                            <CardElement options={cardOptions} />
                            <button type="submit" className="btn-checkout">Checkout</button>
                        </form>
                    </div>
                </>
            )}
            <a href="/" className="back-home-link">Back to Home</a>
            <ToastContainer />
        </div>
    );
};

export default CartPage;
