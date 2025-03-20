import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { FaGlobe, FaChevronDown, FaCheck, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/logo101.png'; // Ensure your logo is correctly placed
import defaultProfileImg from '../../assets/pro1.jpg';

const Navbar = () => {
    const { logout } = useAuth();
    const { userData, updateUserData } = useUser();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef();

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

    const handleLogout = async () => {
        try {
            // Clear all localStorage data
            localStorage.clear();

            // Reset all context states
            updateUserData(null);
            logout();
            setShowUserMenu(false);

            // Wait for the backend logout
            await axios.get('http://localhost:8080/logout', { withCredentials: true });

            // Force navigate to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout anyway
            localStorage.clear();
            window.location.href = '/login';
        }
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
