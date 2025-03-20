// First.jsx
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext.jsx';
import { FaPaw, FaHome, FaWalking, FaHeart, FaShieldAlt, FaUsers, FaClock, FaMapMarkerAlt, FaMedkit } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { userData } = useUser();

    useEffect(() => {
        if (userData) {
            if (userData.role === 'OWNER') {
                navigate('/my-listings');
            } else if (userData.role === 'USER'){
                navigate('/PetSitters');
            } else {
                navigate('/');
            }
        }
    }, [userData, navigate]);

    return (
        <div className="first-page">
            <section className="first-welcome">
                <div className="first-welcome-content">
                    <h1 className="first-welcome-title">Transform Pet Care with PetBuddy</h1>
                    <p className="first-welcome-subtitle">
                        Experience premium pet services tailored to your furry friend's needs
                    </p>
                    <div className="first-cta-buttons">
                        <button onClick={() => navigate('/login')} className="first-btn-primary">
                            Get Started
                        </button>
                        <button onClick={() => navigate('/AboutUs')} className="first-btn-secondary">
                            About Our Services
                        </button>
                    </div>
                </div>
            </section>

            <section className="first-services">
                <h2 className="first-section-title">What We Offer</h2>
                <div className="first-services-grid">
                    <div className="first-service-card">
                        <FaHome className="first-service-icon" />
                        <h3>Luxury Pet Boarding</h3>
                        <p>A home away from home for your beloved pets</p>
                        <ul className="first-service-features">
                            <li><FaClock /> 24/7 Care</li>
                            <li><FaHeart /> Daily Updates</li>
                            <li><FaMapMarkerAlt /> Safe Environment</li>
                        </ul>
                    </div>
                    <div className="first-service-card">
                        <FaPaw className="first-service-icon" />
                        <h3>Premium Pet Sitting</h3>
                        <p>Personalized care in the comfort of your home</p>
                        <ul className="first-service-features">
                            <li><FaMedkit /> Medical Care</li>
                            <li><FaHeart /> Playtime</li>
                            <li><FaHome /> Home Security</li>
                        </ul>
                    </div>
                    <div className="first-service-card">
                        <FaWalking className="first-service-icon" />
                        <h3>Professional Dog Walking</h3>
                        <p>Expert care and exercise for your canine companion</p>
                        <ul className="first-service-features">
                            <li><FaMapMarkerAlt /> GPS Tracking</li>
                            <li><FaClock /> Flexible Times</li>
                            <li><FaPaw /> Exercise Plan</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="first-benefits">
                <h2 className="first-section-title">Why Choose Us</h2>
                <div className="first-benefits-grid">
                    <div className="first-benefit-card">
                        <FaShieldAlt className="benefit-icon" />
                        <h3>Certified Pet Experts</h3>
                        <p>Thoroughly vetted and trained professionals</p>
                    </div>
                    <div className="first-benefit-card">
                        <FaHeart className="benefit-icon" />
                        <h3>Premium Care Standards</h3>
                        <p>Exceptional service quality guaranteed</p>
                    </div>
                    <div className="first-benefit-card">
                        <FaUsers className="benefit-icon" />
                        <h3>Dedicated Support</h3>
                        <p>Round-the-clock assistance for peace of mind</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;