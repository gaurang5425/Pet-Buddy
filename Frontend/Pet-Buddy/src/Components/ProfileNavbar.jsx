import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import './ProfileNavbar.css';
import logo from '../assets/img.png';
import defaultProfileImg from '../assets/pro1.jpg';

const ProfileNavbar = () => {
    const { logout } = useAuth();
    const { userData, updateUserData } = useUser();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const userMenuRef = useRef();
    const servicesRef = useRef();

    const ownerServices = [
        { id: 1, name: 'Add New Listing', icon: '➕' },
        { id: 2, name: 'View My Listings', icon: '📋' },
        { id: 3, name: 'Booking Requests', icon: '📅' },
    ];

    const userServices = [
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
        updateUserData(null);
        logout();
        setShowUserMenu(false);
        window.location.href = 'http://localhost:8080/logout';
    };

    const handleServiceSelect = (serviceName) => {
        setShowServices(false);
        if (userData?.role === 'OWNER') {
            switch (serviceName) {
                case 'Add New Listing':
                    navigate('/create-listing');
                    break;
                case 'View My Listings':
                    navigate('/my-listings');
                    break;
                case 'Booking Requests':
                    navigate('/booking-requests');
                    break;
                default:
                    break;
            }
        } else {
            navigate('/PetSitters', { state: { selectedService: serviceName } });
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    {/*<img src={logo} alt="PetBuddy" className="logo-image" />*/}
                    Logo
                </Link>

                <div className="nav-menu">
                    <div className="services-dropdown" ref={servicesRef}>
                        <button 
                            className="services-btn"
                            onClick={() => setShowServices(!showServices)}
                        >
                            {userData?.role === 'OWNER' ? 'MANAGE SERVICES' : 'GET SERVICES'} <FaChevronDown />
                        </button>
                        {showServices && (
                            <div className="services-menu">
                                {(userData?.role === 'OWNER' ? ownerServices : userServices).map((service) => (
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

                    {userData?.role === 'OWNER' ? (
                        <Link to="/booking-requests" className="nav-link">Booking Requests</Link>
                    ) : (
                        <Link to="/my-requests" className="nav-link">My Requests</Link>
                    )}

                    <div className="user-profile" ref={userMenuRef}>
                        <div 
                            className="profile-trigger"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            {userData?.profileImage ? (
                                <img 
                                    src={userData.profileImage.startsWith('data:') 
                                        ? userData.profileImage 
                                        : `data:image/jpeg;base64,${userData.profileImage}`}
                                    alt="Profile" 
                                    className="profile-image"
                                    onError={(e) => {
                                        console.log('Image load error');
                                        e.target.onerror = null;
                                        e.target.src = defaultProfileImg;
                                    }}
                                />
                            ) : (
                                <FaUserCircle className="profile-icon" />
                            )}
                        </div>
                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <span className="user-name">{userData?.name || 'User'}</span>
                                    <span className="user-email">{userData?.email || 'email@example.com'}</span>
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