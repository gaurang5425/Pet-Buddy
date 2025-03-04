import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RequestSummary.css';

const RequestSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const requestId = location.state?.requestId;
                if (!requestId) {
                    setError('No request ID provided');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/services/requests/${requestId}`);
                setRequestData(response.data);
            } catch (err) {
                console.error('Error fetching request data:', err);
                setError(err.response?.data?.message || 'Error fetching request data');
            } finally {
                setLoading(false);
            }
        };

        fetchRequestData();
    }, [location.state?.requestId]);

    const handlePayment = async () => {
        try {
            const response = await fetch('http://localhost:8080/product/v1/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: requestData.price * 100, // Convert to paise for payment gateway
                    quantity: 1,
                    name: `${requestData.serviceSelected} - ${requestData.petType}`, // Service type and pet type as product name
                    currency: 'INR',
                    requestId: requestData.id
                })
            });

            if (!response.ok) {
                throw new Error('Payment initiation failed');
            }

            const data = await response.json();
            
            if (data.sessionUrl) {
                // Store the request ID in localStorage for retrieval after payment
                localStorage.setItem('paymentRequestId', requestData.id);
                // Redirect to payment gateway checkout page
                window.location.href = data.sessionUrl;
            } else {
                throw new Error('No session URL received');
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            setError('Failed to initiate payment. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading">Loading request details...</div>;
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
        <div className="request-summary-container">
            <div className="request-summary-content">
                <h2>Request Summary</h2>
                
                <div className="summary-section">
                    <h3>Personal Information</h3>
                    <div className="summary-item">
                        <span className="label">Name:</span>
                        <span className="value">{requestData.userName}</span>
                    </div>
                </div>

                <div className="summary-section">
                    <h3>Service Details</h3>
                    <div className="summary-item">
                        <span className="label">Service Provider:</span>
                        <span className="value">{requestData.owner}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Service Type:</span>
                        <span className="value">{requestData.serviceSelected}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Status:</span>
                        <span className={`value status-${requestData.status.toLowerCase()}`}>
                            {requestData.status}
                        </span>
                    </div>
                </div>

                <div className="summary-section">
                    <h3>Pet Information</h3>
                    <div className="summary-item">
                        <span className="label">Number of Pets:</span>
                        <span className="value">{requestData.numberOfPets}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Pet Type:</span>
                        <span className="value">{requestData.petType}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Breed:</span>
                        <span className="value">{requestData.breed}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Size:</span>
                        <span className="value">{requestData.size}</span>
                    </div>
                </div>

                <div className="summary-section">
                    <h3>Booking Details</h3>
                    <div className="summary-item">
                        <span className="label">Start Date:</span>
                        <span className="value">{new Date(requestData.startDate).toLocaleString()}</span>
                    </div>
                    {requestData.additionalInfo && (
                        <div className="summary-item">
                            <span className="label">Additional Information:</span>
                            <span className="value">{requestData.additionalInfo}</span>
                        </div>
                    )}
                </div>

                <div className="summary-section">
                    <h3>Price Details</h3>
                    <div className="summary-item">
                        <span className="label">Service Charge:</span>
                        <span className="value">₹{serviceCharge}</span>
                    </div>
                    
                </div>

                <div className="action-buttons">
                    <button onClick={handlePayment} className="view-bookings-button">
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestSummary; 
