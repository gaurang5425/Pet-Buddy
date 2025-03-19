// Footer.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const toggleVisibility = () => {
        if (window.pageYOffset > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleNavigation = (path) => {
        navigate(path);
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Pet Buddy</h3>
                    <p>Connecting pet owners with reliable pet care services.</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><span onClick={() => handleNavigation('/')} style={{cursor: 'pointer'}}>Home</span></li>
                        <li><span onClick={() => handleNavigation('/AboutUs')} style={{cursor: 'pointer'}}>About Us</span></li>
                        <li><span onClick={() => handleNavigation('/UserContactForm')} style={{cursor: 'pointer'}}>Contact</span></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Legal</h3>
                    <ul>
                        <li><span onClick={() => handleNavigation('/TermsAndConditions')} style={{cursor: 'pointer'}}>Terms & Conditions</span></li>
                        <li><span onClick={() => handleNavigation('/PrivacyPolicy')} style={{cursor: 'pointer'}}>Privacy Policy</span></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: bhadanitirth@gmail.com</p>
                    <p>Phone: +91 7801977543</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Pet Buddy. All rights reserved.</p>
            </div>
            {isVisible && (
                <button
                    className="scroll-top-btn"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}
        </footer>
    );
};

export default Footer;