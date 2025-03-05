import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { FaUser, FaPaw, FaInfoCircle, FaCalendarAlt, FaWallet, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingRequests.css';

const BookingRequests = () => {
    const { userData, pendingTotal, completedTotal, fetchBookingRequests } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusMap = {
        'pending': 'Pending',
        'DONE': 'Completed'
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                console.log('Fetching requests...');
                const response = await axios.get(`http://localhost:8080/api/services/requests`);
                console.log('API Response:', response.data);

                if (!response.data || response.data.length === 0) {
                    console.log('No data received from API');
                    setRequests([]);
                    return;
                }

                const transformedRequests = response.data.map(request => ({
                    id: request.id,
                    service: request.serviceSelected,
                    status: request.status,
                    displayStatus: statusMap[request.status] || request.status,
                    pets: request.numberOfPets,
                    startDate: new Date(request.startDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }),
                    userName: request.userName,
                    owner: request.owner,
                    petType: request.petType,
                    breed: request.breed,
                    size: request.size,
                    additionalInfo: request.additionalInfo,
                    price: request.price
                }));

                console.log('Transformed Requests:', transformedRequests);
                setRequests(transformedRequests);

                // Update context with the new data
                fetchBookingRequests();
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError('Failed to load requests. Please try again later.');
                setRequests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [fetchBookingRequests]);

    const handleView = (requestId) => {
        navigate(`/request/${requestId}`);
    };

    const filteredRequests = requests.filter(request => request.status === activeTab);

    if (loading) {
        return <div className="loading">Loading requests...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="booking-requests-container">
            <div className="requests-header">
                <h1>Booking Requests</h1>
                <div className="requests-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'DONE' ? 'active' : ''}`}
                        onClick={() => setActiveTab('DONE')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            <div className="earnings-overview">
                <div className="earnings-card">
                    <FaWallet className="card-icon" />
                    <div className="card-content">
                        <h3>Total Earnings</h3>
                        <p className="amount">₹{completedTotal + pendingTotal}</p>
                    </div>
                </div>
                <div className="earnings-card">
                    <FaCheckCircle className="card-icon" />
                    <div className="card-content">
                        <h3>Completed Payments</h3>
                        <p className="amount">₹{completedTotal}</p>
                    </div>
                </div>
                <div className="earnings-card">
                    <FaClock className="card-icon" />
                    <div className="card-content">
                        <h3>Pending Payments</h3>
                        <p className="amount">₹{pendingTotal}</p>
                    </div>
                </div>
            </div>

            <div className="requests-list">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className={`request-card ${request.status.toLowerCase()}`}
                            // onClick={() => handleView(request.id)}
                        >
                            <div className="request-info">
                                <div className="request-header">
                                    <h2 data-tooltip={request.service}>{request.service}</h2>
                                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                                        {request.displayStatus}
                                    </span>
                                </div>

                                <div className="left-column">
                                    <div className="info-row">
                                        <FaUser />
                                        <span data-tooltip={request.userName}>{request.userName}</span>
                                    </div>
                                    <div className="info-row">
                                        <FaPaw />
                                        <span data-tooltip={`${request.pets} ${request.petType}(s)`}>
                                            {request.pets} {request.petType}(s)
                                        </span>
                                    </div>

                                    {request.additionalInfo && (
                                        <div className="info-row">
                                            <FaInfoCircle />
                                            <span data-tooltip={request.additionalInfo}>{request.additionalInfo}</span>
                                        </div>
                                    )}
                                    <div className="pet-details">
                                        <p><strong>Breed:</strong> {request.breed}</p>
                                        <p><strong>Size:</strong> {request.size}</p>
                                    </div>
                                </div>

                                <div className="right-column">
                                    <div className="info-row">
                                        <FaCalendarAlt />
                                        <span>Starting from {request.startDate}</span>
                                    </div>
                                    {request.additionalInfo && (
                                        <div className="info-row">
                                            <FaInfoCircle />
                                            <span>{request.additionalInfo}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="price">₹{request.price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-requests-message">
                        <p>No {activeTab === 'DONE' ? 'Completed' : 'Pending'} booking requests at the moment.</p>
                        {activeTab === 'pending' && (
                            <p>New booking requests will appear here!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingRequests;