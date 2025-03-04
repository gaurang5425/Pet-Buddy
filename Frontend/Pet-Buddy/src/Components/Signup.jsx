import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { FaEnvelope, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
    const handleGoogleLogin = () => {
        // Direct redirect to Google OAuth endpoint
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="login-container">
            <h2>Sign Up with PetBuddy for FREE.</h2>
            <button className="email-login">
                <FaEnvelope className="icon" /> Email
            </button>
            <p className="continue-text">or Continue with</p>
            <button className="social-login facebook">
                <FaFacebookF className="icon" /> Facebook
            </button>
            <button className="social-login google" onClick={handleGoogleLogin}>
                <FcGoogle className="icon" /> Sign in with Google
            </button>
            <p className="signup-text">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
            <p className="terms-text">
                By clicking Sign up or Log in, I agree to PetBuddy's <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
        </div>
    );
};

export default Signup;
