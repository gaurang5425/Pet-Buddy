import React from "react";
import "./Signup_login_Footer.css";
import { FaEnvelope } from "react-icons/fa";

const Signup_Login_Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Petbacker</h4>
                    <p>About Us</p>
                    <p>Help Center</p>
                    <p>Terms of Use</p>
                    <p>Privacy Policy</p>
                </div>
                <div className="footer-section">
                    <h4>Pet Lover</h4>
                    <p>Be a Pet Sitter</p>
                    <p>Be a Dog Walker</p>
                    <p>Mobile App</p>
                    <p>Premium Insurance Coverage</p>
                </div>
                <div className="footer-section">
                    <h4>Pet Services</h4>
                    <p>Pet Boarding</p>
                    <p>Pet Day Care</p>
                    <p>Pet Sitting</p>
                    <p>Dog Walking</p>
                    <p>Pet Taxi</p>
                    <p>Pet Grooming</p>
                    <p>Pet Training</p>
                    <p>Pet Photography</p>
                    <p>Veterinarian</p>
                    <p>Explore</p>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p><FaEnvelope /> Email Us</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright © 2025 Petbacker | Version: 1.0.14</p>
                <p>ENGLISH <span role="img" aria-label="flag">🇺🇸</span></p>
            </div>
        </footer>
    );
};

export default Signup_Login_Footer;
