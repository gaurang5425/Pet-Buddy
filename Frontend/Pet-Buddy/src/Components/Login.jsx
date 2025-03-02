import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEnvelope, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { loginWithGoogle, loginWithEmail } = useAuth();

    const handleGoogleLogin = () => {
        if (loginWithGoogle()) {
            if (window.opener) {
                window.opener.location.reload();
                window.close();
            } else {
                navigate('/');
            }
        }
    };

    const handleEmailLogin = () => {
        if (loginWithEmail()) {
            if (window.opener) {
                window.opener.location.reload();
                window.close();
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Please login or signup first to submit your request</h2>
            <button className="email-login" onClick={handleEmailLogin}>
                <FaEnvelope className="icon" /> Email
            </button>
            <p className="continue-text">or Continue with</p>
            <button className="social-login facebook">
                <FaFacebookF className="icon" /> Facebook
            </button>
            <button 
                className="social-login google"
                onClick={handleGoogleLogin}
            >
                <FcGoogle className="icon" /> Sign in with Google
            </button>
            <p className="signup-text">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
