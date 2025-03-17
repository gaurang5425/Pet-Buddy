import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaChevronRight, FaEllipsisV, FaEdit, FaEye, FaBan, FaFilter, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyRequests.css';
import { useUser } from '../context/UserContext';

const MyRequests = () => {
    const { currentUser } = useAuth();
    const { userData } = useUser();
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
                const response = await axios.get(`http://localhost:8080/api/services/requests/user/${userData?.name || 'null'}`);
                const transformedRequests = response.data.map(request => ({
                    id: request.id,
                    service: request.serviceSelected,
                    status: request.status,
                    displayStatus: statusMap[request.status] || request.status,
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
        
    }, [currentUser?.displayName, statusMap, userData?.name]);

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
        <div className="my-req-container">
            <div className="my-req-header">
                <h1>MY REQUESTS</h1>
                <div className="my-req-header-actions">
                    <div className="my-req-filter-container" ref={filterRef}>
                        <button
                            className="my-req-filter-btn"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        >
                            <FaFilter /> {filterStatus}
                        </button>
                        {showFilterDropdown && (
                            <div className="my-req-filter-dropdown">
                                {filterOptions.map((option) => (
                                    <button
                                        key={option}
                                        className={`my-req-filter-option ${filterStatus === option ? 'my-req-active' : ''}`}
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
                        className="my-req-make-request-btn"
                        onClick={() => navigate('/PetSitters')}
                    >
                        MAKE REQUEST
                    </button>
                </div>
            </div>

            <div className="my-req-list">
                {filteredRequests.map((request) => (
                    <div
                        key={request.id}
                        className={`my-req-card ${request.displayStatus.toLowerCase()} ${activeDropdown === request.id ? 'my-req-dropdown-active' : ''}`}
                        onClick={() => handleView(request.id)}
                    >
                        <div className="my-req-info">
                            <div className="my-req-card-header">
                                <h2>{request.service}</h2>
                                <span className={`my-req-status-badge ${request.displayStatus.toLowerCase()}`}>
                                    {request.displayStatus}
                                </span>
                            </div>
                            <div className="my-req-user-info">
                                <FaUser /> <span>{request.userName}</span>
                            </div>
                            <p>{request.pets} Pet(s), from {request.startDate}, {request.courses} course</p>
                        </div>
                        <div className="my-req-actions" ref={dropdownRef}>
                            <button
                                className="my-req-three-dots-btn"
                                onClick={(e) => toggleDropdown(request.id, e)}
                            >
                                <FaEllipsisV />
                            </button>
                            {activeDropdown === request.id && (
                                <div className="my-req-dropdown-menu">
                                    <button onClick={(e) => handleView(request.id, e)}
                                            className="my-req-action-btn">
                                        <FaEye /> View
                                    </button>
                                    <button onClick={(e) => handleEdit(request.id, e)}
                                            className="my-req-action-btn">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={(e) => handleCancel(request.id, e)}
                                            className="my-req-cancel-btn">
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