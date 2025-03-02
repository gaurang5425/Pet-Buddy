import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestSummary.css';

const RequestSummary = () => {
    const navigate = useNavigate();
    const requestDetails = JSON.parse(localStorage.getItem('requestDetails'));

    // Calculate price details
    const serviceCharge = 1500;
    const gst = serviceCharge * 0.18;
    const totalAmount = serviceCharge + gst;

    // Create formatted request summary object
    const requestSummary = {
        requestDetails: {
            serviceSelected: requestDetails.service,
            numberOfPets: requestDetails.petCount,
            petType: requestDetails.petType,
            breed: requestDetails.breed || '-',
            size: requestDetails.size,
            additionalInfo: requestDetails.additionalInfo || '-',
            startDate: new Date(requestDetails.startDate).toLocaleString()
        },
        priceDetails: {
            serviceCharge: `₹${serviceCharge}`,
            gst: `₹${gst}`,
            totalAmount: `₹${totalAmount}`
        }
    };

    useEffect(() => {
        // Log formatted request summary
        console.log('Request Summary:');
        console.log(JSON.stringify(requestSummary, null, 2));
    }, []);

    const handlePayment = () => {
        // Randomly navigate to success or failure page (50-50 chance)
        const isSuccess = Math.random() >= 0.5;
        navigate(isSuccess ? '/payment-success' : '/payment-failure');
    };

    return (
        <div className="summary-container-outer">
            <div className="summary-container">
                <h2>Request Summary</h2>
                <p className="summary-description">
                    Confirm or edit the details of your request before sending it out to pet lovers in your area.
                </p>

                <div className="summary-details">
                    <div className="summary-item">
                        <h3>Service Selected</h3>
                        <p>{requestDetails.service}</p>
                    </div>

                    <div className="summary-item">
                        <h3>How many pets do you need to board?</h3>
                        <p>{requestDetails.petCount}</p>
                    </div>

                    <div className="summary-item">
                        <h3>What type of pet is it?</h3>
                        <p>{requestDetails.petType}</p>
                    </div>

                    <div className="summary-item">
                        <h3>What breed is it?</h3>
                        <p>{requestDetails.breed || '-'}</p>
                    </div>

                    <div className="summary-item">
                        <h3>What is the size of your pet?</h3>
                        <p>{requestDetails.size}</p>
                    </div>

                    <div className="summary-item">
                        <h3>Additional Information</h3>
                        <p>{requestDetails.additionalInfo || '-'}</p>
                    </div>

                    <div className="summary-item">
                        <h3>Service Start Date</h3>
                        <p>{new Date(requestDetails.startDate).toLocaleString()}</p>
                    </div>
                </div>

                <div className="price-summary">
                    <h3>Price Details</h3>
                    <div className="price-item">
                        <span>Service Charge</span>
                        <span>₹1500</span>
                    </div>
                    <div className="price-item">
                        <span>GST (18%)</span>
                        <span>₹270</span>
                    </div>
                    <div className="price-item total">
                        <span>Total Amount</span>
                        <span>₹1770</span>
                    </div>
                </div>

                <div className="action-buttons">
                    <button onClick={() => navigate(-1)} className="back-button">
                        Edit Details
                    </button>
                    <button onClick={handlePayment} className="payment-button">
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestSummary; 
