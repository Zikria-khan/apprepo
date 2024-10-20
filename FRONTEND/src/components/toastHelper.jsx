// toastHelper.js
import { toast } from 'react-toastify';

// Customized success toast
export const showSuccessToast = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000, // Closes automatically after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
            backgroundColor: '#4BB543', // Success green color
            color: '#fff',
            fontSize: '16px',
        },
    });
};

// Customized error toast
export const showErrorToast = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
            backgroundColor: '#FF0000', // Error red color
            color: '#fff',
            fontSize: '16px',
        },
    });
};
