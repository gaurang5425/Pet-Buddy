import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.jsx';
import { FaUser, FaPaw, FaInfoCircle, FaCalendarAlt, FaWallet, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingRequests.css';

const BookingRequests = () => {
    const { userData, pendingTotal, completedTotal, fetchBookingRequests } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PENDING');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusMap = {
        'PENDING': 'Pending',
        'DONE': 'Completed'
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                if (!userData?.name) {
                    setRequests([]);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/services/requests/owner/${encodeURIComponent(userData.name)}`);
                const data = response.data;

                // Calculate totals directly from API response
                const pendingAmount = data
                    .filter(request => request.status === 'PENDING')
                    .reduce((sum, request) => sum + (request.price || 0), 0);

                const completedAmount = data
                    .filter(request => request.status === 'DONE')
                    .reduce((sum, request) => sum + (request.price || 0), 0);

                // Transform the requests
                const transformedRequests = data.map(request => ({
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

                setRequests(transformedRequests);

                // Update the earnings in UserContext
                await fetchBookingRequests({
                    pendingTotal: pendingAmount,
                    completedTotal: completedAmount
                });
            } catch (err) {
                console.error('Error fetching requests:', err);
                if (err.response?.status === 404) {
                    setRequests([]);  // Set empty array for 404
                } else {
                    setError('Failed to load booking requests. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [userData?.name, fetchBookingRequests]);

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
                        className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
                        onClick={() => setActiveTab('PENDING')}
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

            {requests.length > 0 && (
                <div className="earnings-overview">
                    <div className="earnings-card">
                        <FaWallet className="card-icon" />
                        <div className="card-content">
                            <h3>Total Earnings</h3>
                            <p className="amount">₹{(requests.reduce((sum, req) => sum + (req.price || 0), 0)).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="earnings-card">
                        <FaCheckCircle className="card-icon" />
                        <div className="card-content">
                            <h3>Completed Payments</h3>
                            <p className="amount">₹{(requests.filter(req => req.status === 'DONE')
                                .reduce((sum, req) => sum + (req.price || 0), 0)).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="earnings-card">
                        <FaClock className="card-icon" />
                        <div className="card-content">
                            <h3>Pending Payments</h3>
                            <p className="amount">₹{(requests.filter(req => req.status === 'PENDING')
                                .reduce((sum, req) => sum + (req.price || 0), 0)).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="requests-list">
                {error ? (
                    <div className="error-message">
                        <FaInfoCircle className="error-icon" />
                        <p>{error}</p>
                    </div>
                ) : requests.length === 0 && !error ? (
                    <div className="no-listings-message">
                        <FaPaw className="empty-icon" />
                        <h2>No Booking Requests Yet</h2>
                        <p>Start receiving booking requests when customers book your services!<br />
                            They will appear here once customers make bookings.</p>
                    </div>
                ) : (
                    filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className={`request-card ${request.status.toLowerCase()}`}
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
                            <p>No {activeTab === 'DONE' ? 'completed' : 'pending'} booking requests at the moment.</p>
                            {activeTab === 'PENDING' && (
                                <p>New booking requests will appear here!</p>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default BookingRequests;