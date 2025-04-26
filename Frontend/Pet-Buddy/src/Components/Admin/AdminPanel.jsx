// ...imports (same as before)
import React, { useState, useEffect } from 'react';
import { FaTrash, FaUserCog, FaCog, FaStar, FaSort } from 'react-icons/fa';
import axios from 'axios';
import './AdminPanel.css';
import { FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showManageDropdown, setShowManageDropdown] = useState(false);
    const [newType, setNewType] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();
    const extendedServiceTypes = ['All', ...serviceTypes, 'Other', 'Manage Service Types'];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchServices();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/all');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pet-services');
            setServices(response.data);
            const uniqueTypes = response.data
                .map(service => service.serviceType)
                .filter((value, index, self) => value && self.indexOf(value) === index);
            setServiceTypes(uniqueTypes);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = (data) => {
        if (!sortConfig.key) return data;
        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    };

    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/user/delete/${selectedUserId}`);
            console.log(`Deleting user with ID: ${selectedUserId}`);
            setShowConfirm(false);
            setSelectedUserId(null);
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setSelectedUserId(null);
    };

    const handleDropdownChange = (value) => {
        if (value === 'Manage Service Types') {
            setShowManageDropdown(true);
        } else {
            setSelectedServiceType(value);
        }
    };

    const handleAddServiceType = () => {
        if (newType && !serviceTypes.includes(newType)) {
            setServiceTypes(prev => [...prev, newType]);
            setNewType('');
        }
    };

    const handleRemoveServiceType = (type) => {
        setServiceTypes(prev => prev.filter(t => t !== type));
    };

    const filteredServices = selectedServiceType === 'All'
        ? services
        : services.filter(s =>
            (selectedServiceType === 'Other' && !serviceTypes.includes(s.serviceType)) ||
            s.serviceType === selectedServiceType
        );

    const handleCardClick = (cardId) => {
        navigate(`/pet-sitter-data/${cardId}`);
    };

    return (
        <div className="admin-panel">
            {/* Header and Stats */}
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-stats">
                    <div className="stat-card"><FaUserCog /><div><h3>{users.length}</h3><p>Total Users</p></div></div>
                    <div className="stat-card"><FaCog /><div><h3>{services.length}</h3><p>Active Services</p></div></div>
                    <div className="stat-card"><FaStar /><div><h3>4.8</h3><p>Average Rating</p></div></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
                <button className={`tab-button ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
            </div>

            {/* Content */}
            <div className="admin-content">
                {activeTab === 'users' && (
                    <div className="users-section">
                        <div className="section-header"><h2>User Management</h2></div>
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')}>ID <FaSort /></th>
                                    <th onClick={() => handleSort('name')}>Name <FaSort /></th>
                                    <th onClick={() => handleSort('email')}>Email <FaSort /></th>
                                    <th onClick={() => handleSort('role')}>Role <FaSort /></th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getSortedData(users).map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                          <span className={`role-badge ${user.role?.toLowerCase() || 'unknown'}`}>
                                            {user.role || 'Unknown'}
                                          </span>
                                        </td>

                                        <td>
                                            <button className="delete-btn" onClick={() => handleDeleteClick(user.id)}>
                                                <FaTrash /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="admin-services-section">
                        <div className="section-header">
                            <h2>Service Management</h2>
                            <select
                                value={selectedServiceType}
                                onChange={(e) => handleDropdownChange(e.target.value)}
                                className="service-dropdown"
                            >
                                {extendedServiceTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Service Type</th>
                                    <th>Provider</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredServices.map((service, index) => (
                                    <tr key={service.id} onClick={() => handleCardClick(service.id)}>
                                        <td>{index + 1}</td>
                                        <td>{service.serviceType}</td>
                                        <td>{service.ownerName}</td>
                                        <td>
                                          <span className={`status-badge ${service.req_accepted ? 'done' : 'pending'}`}>
                                            {service.req_accepted ? (
                                                <>
                                                    <FaCheckCircle style={{ marginRight: '5px' }} />Done
                                                </>
                                            ) : (
                                                <>
                                                    <FaHourglassHalf style={{ marginRight: '5px' }} />Pending
                                                </>
                                            )}
                                          </span>
                                        </td>
                                        <td>₹ {service.price}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {showManageDropdown && (
                            <div className="dropdown-modal">
                                <h3>Manage Service Types</h3>
                                <input
                                    type="text"
                                    placeholder="New service type"
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                />
                                <button onClick={handleAddServiceType}>Add</button>
                                <ul>
                                    {serviceTypes.map(type => (
                                        <li key={type}>
                                            {type}
                                            <button className="remove-btn" onClick={() => handleRemoveServiceType(type)}>❌</button>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => setShowManageDropdown(false)} className="close-btn">Close</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Delete Confirmation Modal */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this user?</p>
                        <div className="modal-buttons">
                            <button className="confirm-btn" onClick={handleConfirmDelete}>Yes, Delete</button>
                            <button className="cancel-btn" onClick={handleCancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
