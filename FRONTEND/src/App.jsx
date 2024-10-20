import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure you include the CSS
import HomePage from './components/Homepage'; // Make sure the path is correct
import CartPage from './components/Cartpage'; // Make sure the path is correct
import LoginPage from './components/Loginpage'; // Make sure the path is correct
import RegisterPage from './components/RegisterPage'; // Make sure the path is correct
import VeiwDetail from './components/veiwDetail'; // Import your Detail Product page
// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error occurred: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}

const App = () => {
  return (
    <ErrorBoundary> {/* Wrap the entire application with ErrorBoundary */}
   <ToastContainer 
  style={{ 
    position: 'absolute', 
    top: '20px', 
    right: '20px', 
    zIndex: 1000 // Ensures it is on top of other elements
  }} 
/>
 

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<VeiwDetail/>} /> {/* Product detail route */}
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
