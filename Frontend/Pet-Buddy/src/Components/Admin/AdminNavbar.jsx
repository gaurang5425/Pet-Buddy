import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCog, FaSignOutAlt } from 'react-icons/fa';
import './AdminNavbar.css';
import logo from '../../assets/logo101.png';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear admin session
        localStorage.removeItem('adminAuth');
        // Redirect to login
        navigate('/login');
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-container">
                <Link to="/admin" className="admin-navbar-logo">
                    <img src={logo} alt="PetBuddy Admin" className="admin-logo-image" />
                    <span className="admin-title">Admin Panel</span>
                </Link>

                <div className="admin-nav-menu">
                    <Link to="/admin/users" className="admin-nav-link">Users</Link>
                    <Link to="/admin/services" className="admin-nav-link">Services</Link>
                    <Link to="/admin/requests" className="admin-nav-link">Requests</Link>
                    <Link to="/admin/reports" className="admin-nav-link">Reports</Link>

                    <div className="admin-profile">
                        <span className="admin-email">admin@gmail.com</span>
                        <FaUserCog className="admin-icon" />
                        <button onClick={handleLogout} className="admin-logout">
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;