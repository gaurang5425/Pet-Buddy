import React from 'react';
import { Link } from 'react-router-dom';
import './LoginNavbar.css';
import logo from '../assets/img.png'; // Ensure your logo is correctly placed

const LoginNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="PetBuddy" className="logo-image" />
                </Link>

                <div className="nav-menu">
                    <Link to="/Login" className="nav-link">Signup / Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default LoginNavbar;
