import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './PaymentStatus.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="payment-status-container">
            <div className="payment-status-card success">
                <FaCheckCircle className="status-icon success" />
                <h1>Payment Successful!</h1>
                <p>Your booking has been confirmed. Thank you for choosing Pet-Buddy!</p>
                <div className="payment-details">
                    <div className="detail-item">
                        <span>Transaction ID:</span>
                        <span>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                    <div className="detail-item">
                        <span>Amount Paid:</span>
                        <span>₹15000</span>
                    </div>
                </div>
                <button onClick={handleBackToHome} className="back-button">
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess; 