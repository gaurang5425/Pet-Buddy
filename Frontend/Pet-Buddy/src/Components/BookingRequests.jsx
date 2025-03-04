import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import './BookingRequests.css';

const BookingRequests = () => {
    const { userData } = useUser();
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="booking-requests-container">
            <h1>Booking Requests</h1>
            
            <div className="requests-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accepted')}
                >
                    Accepted
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'declined' ? 'active' : ''}`}
                    onClick={() => setActiveTab('declined')}
                >
                    Declined
                </button>
            </div>

            <div className="requests-list">
                {/* Placeholder for requests */}
                <div className="no-requests-message">
                    <p>No {activeTab} booking requests at the moment.</p>
                    {activeTab === 'pending' && (
                        <p>New booking requests will appear here!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingRequests; 