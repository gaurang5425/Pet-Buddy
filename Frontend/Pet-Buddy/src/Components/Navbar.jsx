import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { FaGlobe, FaChevronDown, FaCheck, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';
import logo from '../assets/img.png'; // Ensure your logo is correctly placed
import defaultProfileImg from '../assets/pro1.jpg';

const Navbar = () => {
    const { logout } = useAuth();
    const { userData, updateUserData } = useUser();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef();

    const languages = [
        { code: 'en', name: 'English', icon: '🇺🇸' },
        { code: 'es', name: 'Español', icon: '🇪🇸' },
        { code: 'fr', name: 'Français', icon: '🇫🇷' },
        { code: 'de', name: 'Deutsch', icon: '🇩🇪' },
        { code: 'hi', name: 'हिंदी', icon: '🇮🇳' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Clear user context
        updateUserData(null);
        // Clear auth context
        logout();
        // Close menu
        setShowUserMenu(false);
        // Redirect to backend logout endpoint
        window.location.href = 'http://localhost:8080/logout';
    };

    const renderNavLinks = () => {
        if (!userData) {
            return (
                <>
                    {/* <Link to="/PetSitters" className="nav-link">Services Near Me</Link>
                    <Link to="/HelpCenter" className="nav-link">Help Center</Link> */}
                </>
            );
        }

        if (userData.role === 'OWNER') {
            return (
                <>
                    <Link to="/my-listings" className="nav-link">My Listings</Link>
                    <Link to="/booking-requests" className="nav-link">Booking Requests</Link>
                    <Link to="/earnings" className="nav-link">My Earnings</Link>
                    <Link to="/HelpCenter" className="nav-link">Help Center</Link>
                </>
            );
        }

        // Default for USER role
        return (
            <>
                <Link to="/PetSitters" className="nav-link">Services Near Me</Link>
                <Link to="/my-requests" className="nav-link">My Requests</Link>
                <Link to="/HelpCenter" className="nav-link">Help Center</Link>
            </>
        );
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="PetBuddy" className="logo-image" />
                </Link>

                <div className="nav-menu">
                    {renderNavLinks()}

                    <div className="language-selector">
                        <button 
                            className="language-button" 
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <FaGlobe className="globe-icon" />
                            <span className="selected-language">
                                {languages.find(lang => lang.code === selectedLang)?.icon}
                            </span>
                            <FaChevronDown className={`arrow-icon ${isOpen ? 'open' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="language-dropdown">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className="language-option"
                                        onClick={() => {
                                            setSelectedLang(lang.code);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="language-icon">{lang.icon}</span>
                                        <span className="language-name">{lang.name}</span>
                                        {selectedLang === lang.code && (
                                            <FaCheck className="check-icon" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {userData ? (
                        <div className="user-profile" ref={menuRef}>
                            <div 
                                className="profile-trigger"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {userData.profileImage ? (
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
                                        <span className="user-name">{userData.name || 'User'}</span>
                                        <span className="user-email">{userData.email || 'email@example.com'}</span>
                                    </div>
                                    <Link to="/UserProfile" className="dropdown-item">My Profile</Link>
                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/Login" className="nav-link login-link">
                            Sign Up / Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
