import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import './PaymentStatus.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                // Try to get requestId from location state first
                let requestId = location.state?.requestId;
                
                // If not in location state, try to get from localStorage
                if (!requestId) {
                    requestId = localStorage.getItem('paymentRequestId');
                }

                if (!requestId) {
                    setError('Unable to find booking details. Please contact support if this persists.');
                    setLoading(false);
                    return;
                }

                // Fetch current request data
                const response = await axios.get(`http://localhost:8080/api/services/requests/${requestId}`);
                const currentData = response.data;
                setRequestData(currentData);

                // Create updated data with status changed to DONE
                const updatedData = {
                    ...currentData,
                    status: 'DONE'
                };

                // Update the request with new status
                try {
                    await axios.put(`http://localhost:8080/api/services/requests/${requestId}`, updatedData);
                    // Update local state with new status
                    setRequestData(updatedData);
                } catch (updateError) {
                    console.error('Error updating request status:', updateError);
                    // Don't show error to user as the payment was successful
                }
                
                // Clear the stored request ID after successful fetch
                localStorage.removeItem('paymentRequestId');
            } catch (err) {
                console.error('Error fetching request data:', err);
                setError(err.response?.data?.message || 'Error fetching request data');
            } finally {
                setLoading(false);
            }
        };

        fetchRequestData();
    }, [location.state?.requestId]);

    const handleBackToHome = () => {
        navigate('/');
    };

    if (loading) {
        return <div className="loading">Loading payment details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!requestData) {
        return <div className="error-message">No request data found</div>;
    }

    // Calculate price details
    const serviceCharge = requestData.price;
    const gst = serviceCharge * 0.18;
    const totalAmount = serviceCharge + gst;

    return (
        <div className="payment-status-container">
            <div className="payment-status-card success">
                <FaCheckCircle className="status-icon success" />
                <h1>Payment Successful!</h1>
                <p>Your booking has been confirmed. Thank you for choosing Pet-Buddy!</p>
                
                <div className="payment-details">
                    <h3>Booking Details</h3>
                    <div className="detail-item">
                        <span>Request ID:</span>
                        <span>#{requestData.id}</span>
                    </div>
                    <div className="detail-item">
                        <span>Service Type:</span>
                        <span>{requestData.serviceSelected}</span>
                    </div>
                    <div className="detail-item">
                        <span>Pet Type:</span>
                        <span>{requestData.petType}</span>
                    </div>
                    <div className="detail-item">
                        <span>Pet Breed:</span>
                        <span>{requestData.breed}</span>
                    </div>
                    <div className="detail-item">
                        <span>Service Provider:</span>
                        <span>{requestData.owner}</span>
                    </div>
                    <div className="detail-item">
                        <span>Start Date:</span>
                        <span>{new Date(requestData.startDate).toLocaleString()}</span>
                    </div>
                </div>

                <div className="payment-summary">
                    <div className="detail-item">
                        <span>Service Charge:</span>
                        <span>₹{serviceCharge}</span>
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