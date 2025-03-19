import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.jsx';
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
                if (!userData?.name) {
                    setRequests([]);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/services/requests/owner/${encodeURIComponent(userData.name)}`);
                const data = response.data;

                if (!data || data.length === 0) {
                    setRequests([]);
                    return;
                }

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
                fetchBookingRequests();
            } catch (err) {
                console.error('Error fetching requests:', err);
                // Set empty requests array for 404 or any other error
                setRequests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [userData?.name, fetchBookingRequests]);

    if (loading) {
        return (
            <div className="my-listings-container-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your booking requests...</p>
                </div>
            </div>
        );
    }

    const filteredRequests = requests.filter(request => request.status === activeTab);

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

            {requests.length > 0 && (
            <div className="earnings-overview">
                <div className="earnings-card">
                    <FaWallet className="card-icon" />
                    <div className="card-content">
                        <h3>Total Earnings</h3>
                        <p className="amount">₹{(completedTotal + pendingTotal).toFixed(2)}</p>
                    </div>
                </div>
                <div className="earnings-card">
                    <FaCheckCircle className="card-icon" />
                    <div className="card-content">
                        <h3>Completed Payments</h3>
                        <p className="amount">₹{completedTotal.toFixed(2)}</p>
                    </div>
                </div>
                <div className="earnings-card">
                    <FaClock className="card-icon" />
                    <div className="card-content">
                        <h3>Pending Payments</h3>
                        <p className="amount">₹{pendingTotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            )}

            <div className="requests-list">
                {requests.length === 0 ? (
                    <div className="no-listings-message">
                        <FaPaw className="empty-icon" />
                        <h2>No Booking Requests Yet</h2>
                        <p>Start receiving booking requests when customers book your services!<br />
                            They will appear here once customers make bookings.</p>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default BookingRequests;