import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './PaymentStatus.css';

const PaymentFailure = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate(-1); // Go back to previous page
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="payment-status-container">
            <div className="payment-status-card failure">
                <FaTimesCircle className="status-icon failure" />
                <h1>Payment Failed</h1>
                <p>Oops! Something went wrong with your payment. Please try again.</p>
                <div className="payment-details">
                    <div className="detail-item">
                        <span>Error Code:</span>
                        <span>#{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                </div>
                <div className="button-group">
                    <button onClick={handleRetry} className="retry-button">
                        Try Again
                    </button>
                    <button onClick={handleBackToHome} className="back-button">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure; 