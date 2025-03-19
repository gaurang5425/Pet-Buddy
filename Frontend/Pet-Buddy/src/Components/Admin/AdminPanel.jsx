import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        fetchUsers();
        fetchServices();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="admin-panel">
            <h1>Admin Dashboard</h1>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={activeTab === 'services' ? 'active' : ''}
                    onClick={() => setActiveTab('services')}
                >
                    Services
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="users-section">
                    <h2>User Management</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'services' && (
                <div className="services-section">
                    <h2>Service Management</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Service Type</th>
                            <th>Provider</th>
                            <th>Status</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td>{service.type}</td>
                                <td>{service.providerName}</td>
                                <td>{service.status}</td>
                                <td>${service.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;