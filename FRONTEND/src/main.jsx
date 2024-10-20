import React from 'react';
import ReactDOM from 'react-dom/client'; // use 'react-dom/client' instead of 'react-dom'
import App from './App';
import "./components/Homepage.css"
import "./components/AddProducts.css"
import "./components/detailProducts.css"
import { BrowserRouter } from 'react-router-dom';
// Create a root and render the App
const root = ReactDOM.createRoot(document.getElementById('root')); // Using createRoot

root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
);
