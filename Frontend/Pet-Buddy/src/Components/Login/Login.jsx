import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Home&Help/Auth.css";
import { FaEnvelope, FaFacebookF, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        // Direct redirect to Google OAuth endpoint
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const handleEmailLogin = (e) => {
        e.preventDefault();
        // Handle email login logic here
        console.log("Email login attempted with:", { email, password });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for admin credentials
        if (email === 'admin@gmail.com' && password === 'admin') {
            // Redirect to admin panel
            navigate('/admin');
            return;
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome Back!</h2>
            <p className="login-subtitle">Please login to continue</p>
            
            <form onSubmit={handleEmailLogin} className="login-form">
                <div className="form-group">
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            style={{ backgroundColor: "white", color: "black"  }} // Ensures white background
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                            style={{ backgroundColor: "white", color: "black"  }}
                        />
                    </div>
                </div>

                <button type="submit" className="login-button" onClick={handleSubmit}>
                    Login
                </button>
            </form>

            <div className="divider">
                <span>or</span>
            </div>

            <button 
                className="social-login google"
                onClick={handleGoogleLogin}
            >
                <FcGoogle className="icon" /> Sign in with Google
            </button>

            <p className="signup-text">
                Don't have an account? <Link onClick={handleGoogleLogin}>Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
