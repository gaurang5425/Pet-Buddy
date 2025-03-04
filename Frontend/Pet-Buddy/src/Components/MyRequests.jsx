import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaChevronRight, FaEllipsisV, FaEdit, FaEye, FaBan, FaFilter, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyRequests.css';

const MyRequests = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterRef = useRef(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Map API status values to display values
    const statusMap = {
        'PENDING': 'Active',
        'ACTIVE': 'Active',
        'COMPLETED': 'Done',
        'CANCELLED': 'Closed',
        'DONE': 'Done'
    };

    // Get unique status values from API for filter options
    const getFilterOptions = (requests) => {
        const uniqueStatuses = new Set(requests.map(request => statusMap[request.status] || request.status));
        return ['All', ...Array.from(uniqueStatuses)];
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/services/requests');
                // Transform the API data to match our UI structure
                const transformedRequests = response.data.map(request => ({
                    id: request.id,
                    service: request.serviceSelected,
                    status: request.status,
                    displayStatus: statusMap[request.status] || request.status, // Add display status
                    pets: request.numberOfPets,
                    startDate: new Date(request.startDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                    }),
                    courses: 1,
                    userName: request.userName || currentUser?.displayName || 'Anonymous User'
                }));
                setRequests(transformedRequests);
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError('Failed to load requests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [currentUser?.displayName]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleView = (requestId, e) => {
        if (e) e.stopPropagation();
        navigate(`/request/${requestId}`);
    };

    const handleEdit = (requestId, e) => {
        e.stopPropagation();
        navigate(`/edit-request/${requestId}`);
        setActiveDropdown(null);
    };

    const handleCancel = (requestId, e) => {
        e.stopPropagation();
        console.log('Canceling request:', requestId);
        setActiveDropdown(null);
    };

    const toggleDropdown = (requestId, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === requestId ? null : requestId);
    };

    // Get filter options based on available statuses
    const filterOptions = getFilterOptions(requests);

    const filteredRequests = requests.filter(request => {
        if (filterStatus === 'All') return true;
        return request.displayStatus === filterStatus;
    });

    if (loading) {
        return <div className="loading">Loading requests...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="requests-container">
            <div className="requests-header">
                <h1>MY REQUESTS</h1>
                <div className="header-actions">
                    <div className="filter-container" ref={filterRef}>
                        <button 
                            className="filter-btn"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        >
                            <FaFilter /> {filterStatus}
                        </button>
                        {showFilterDropdown && (
                            <div className="filter-dropdown">
                                {filterOptions.map((option) => (
                                    <button
                                        key={option}
                                        className={`filter-option ${filterStatus === option ? 'active' : ''}`}
                                        onClick={() => {
                                            setFilterStatus(option);
                                            setShowFilterDropdown(false);
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        className="make-request-btn"
                        onClick={() => navigate('/PetSitters')}
                    >
                        MAKE REQUEST
                    </button>
                </div>
            </div>

            <div className="requests-list">
                {filteredRequests.map((request) => (
                    <div 
                        key={request.id} 
                        className={`request-card ${request.displayStatus.toLowerCase()} ${activeDropdown === request.id ? 'dropdown-active' : ''}`} 
                        onClick={() => handleView(request.id)}
                    >
                        <div className="request-info">
                            <div className="request-header">
                                <h2>{request.service}</h2>
                                <span className={`status-badge ${request.displayStatus.toLowerCase()}`}>
                                    {request.displayStatus}
                                </span>
                            </div>
                            <div className="user-info">
                                <FaUser /> <span>{request.userName}</span>
                            </div>
                            <p>{request.pets} Pet(s), from {request.startDate}, {request.courses} course</p>
                        </div>
                        <div className="request-actions" ref={dropdownRef}>
                            <button 
                                className="three-dots-btn"
                                onClick={(e) => toggleDropdown(request.id, e)}
                            >
                                <FaEllipsisV />
                            </button>
                            {activeDropdown === request.id && (
                                <div className="dropdown-menu">
                                    <button onClick={(e) => handleView(request.id, e)}>
                                        <FaEye /> View
                                    </button>
                                    <button onClick={(e) => handleEdit(request.id, e)}>
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={(e) => handleCancel(request.id, e)} className="cancel-btn">
                                        <FaBan /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRequests;