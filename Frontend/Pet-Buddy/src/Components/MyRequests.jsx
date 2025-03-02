import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaChevronRight, FaEllipsisV, FaEdit, FaEye, FaBan, FaFilter, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MyRequests.css';

const MyRequests = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterRef = useRef(null);
    
    const [requests] = useState([
        {
            id: 1,
            service: 'Pet Training',
            status: 'Active',
            pets: 2,
            startDate: 'Fri 28 Feb',
            courses: 1,
            userName: currentUser?.displayName || 'Anonymous User'
        },
        {
            id: 2,
            service: 'Pet Training',
            status: 'Closed',
            pets: 1,
            startDate: 'Mon 25 Feb',
            courses: 2,
            userName: currentUser?.displayName || 'Anonymous User'
        },
        {
            id: 3,
            service: 'Dog Walking',
            status: 'Done',
            pets: 1,
            startDate: 'Wed 1 Mar',
            courses: 1,
            userName: currentUser?.displayName || 'Anonymous User'
        },
        {
            id: 4,
            service: 'Pet Grooming',
            status: 'Done',
            pets: 2,
            startDate: 'Tue 15 Feb',
            courses: 1,
            userName: currentUser?.displayName || 'Anonymous User'
        }
    ]);

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

    const filterOptions = ['All', 'Active', 'Closed', 'Done'];

    const filteredRequests = requests.filter(request => {
        if (filterStatus === 'All') return true;
        return request.status === filterStatus;
    });

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
                        onClick={() => navigate('/services')}
                    >
                        MAKE REQUEST
                    </button>
                </div>
            </div>

            <div className="requests-list">
                {filteredRequests.map((request) => (
                    <div 
                        key={request.id} 
                        className={`request-card ${request.status.toLowerCase()} ${activeDropdown === request.id ? 'dropdown-active' : ''}`} 
                        onClick={() => handleView(request.id)}
                    >
                        <div className="request-info">
                            <div className="request-header">
                                <h2>{request.service}</h2>
                                <span className={`status-badge ${request.status.toLowerCase()}`}>
                                    {request.status}
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