import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import './ProfileNavbar.css';
import logo from '../assets/img.png';

const ProfileNavbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const userMenuRef = useRef();
    const servicesRef = useRef();

    const services = [
        { id: 1, name: 'Pet Boarding', icon: '🏠' },
        { id: 2, name: 'Pet Day Care', icon: '🌞' },
        { id: 3, name: 'Pet Sitting', icon: '🐱' },
        { id: 4, name: 'Dog Walking', icon: '🦮' },
        { id: 5, name: 'Pet Taxi', icon: '🚗' },
        { id: 6, name: 'Pet Grooming', icon: '✂️' },
        { id: 7, name: 'Pet Training', icon: '🎾' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                setShowServices(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    const handleServiceSelect = (serviceName) => {
        setShowServices(false);
        navigate('/ContactForm', { state: { selectedService: serviceName } });
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="PetBuddy" className="logo-image" />
                </Link>

                <div className="nav-menu">
                    <div className="services-dropdown" ref={servicesRef}>
                        <button 
                            className="services-btn"
                            onClick={() => setShowServices(!showServices)}
                        >
                            GET SERVICES <FaChevronDown />
                        </button>
                        {showServices && (
                            <div className="services-menu">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        className="service-item"
                                        onClick={() => handleServiceSelect(service.name)}
                                    >
                                        <span className="service-icon">{service.icon}</span>
                                        {service.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/my-requests" className="nav-link">My Requests</Link>

                    <div className="user-profile" ref={userMenuRef}>
                        <div 
                            className="profile-trigger"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            {currentUser?.profileImage ? (
                                <img 
                                    src={currentUser.profileImage} 
                                    alt="Profile" 
                                    className="profile-image"
                                />
                            ) : (
                                <FaUserCircle className="profile-icon" />
                            )}
                        </div>
                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <span className="user-name">{currentUser?.name}</span>
                                    <span className="user-email">{currentUser?.email}</span>
                                </div>
                                <Link to="/UserProfile" className="dropdown-item">My Profile</Link>
                                <button onClick={handleLogout} className="dropdown-item logout">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ProfileNavbar; 