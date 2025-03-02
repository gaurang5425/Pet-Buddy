import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaHome, FaPhone, FaEnvelope, FaIdCard, FaCheckCircle, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import './PetSitterProfile.css';
import pro1 from '../assets/pro1.jpg';
import pro11 from '../assets/pro11.jpg';
import pro12 from '../assets/pro12.jpg';
import pro13 from '../assets/pro13.jpg';
import completed from '../assets/completed-job.png';
import certification from '../assets/certification.png';
import email from '../assets/email.png';
import ids from '../assets/id.png';
import mobile from '../assets/mobile.png';
import visa from '../assets/visa.png';
import mastercard from '../assets/mastercard.png';
import paypal from '../assets/paypal.png';
import americanExpress from '../assets/americancard.png';

const PetSitterProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Hardcoded data for demo (later can be fetched based on id)
    const profile = {
        id: 1,
        title: "Pet Boarding / Home Stay / Day Care @ Ahmedabad",
        owner: "Tirth",
        rating: 5,
        reviews: 6,
        profileImage: pro1,
        completedBookings: 3,
        location: "Ahmedabad, Gujarat",
        services: ["Pet Boarding","Dog Walking"],
        additionalLocations: "Can also work at Chandkheda, Thaltej, Motera, New CG ...",
        images: [
            pro11,
            pro12,
            pro13
        ]
    };

    const handleContact = () => {
        navigate('/ContactForm');
    };

    return (
        <div className="profile-container">
            <div className="left-column">
                <div className="profile-header">
                    <div className="profile-info">
                        <img src={profile.profileImage} alt="Profile" className="PetSitterProfile-profile-image" />
                        <div className="profile-content-wrapper">
                            <div className="title-row">
                                <h1>{profile.title}</h1>
                            </div>
                            <div className="author-row">
                                <span>by {profile.owner}</span>
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="star-icon" />
                                    ))}
                                </div>
                                <span className="reviews-count">({profile.reviews} Reviews)</span>
                            </div>
                            <div className="booking-badge">
                                <FaCalendar className="calendar-icon" />
                                <span>{profile.completedBookings} Completed Bookings</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="location-bar">
                    <FaMapMarkerAlt className="location-icon" />
                    <span>{profile.location} | {profile.services.join(", ")}</span>
                </div>

                <div className="main-section">
                    <h2>Anupam & Guest's Pets</h2>
                    <div className="gallery">
                        {profile.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img}
                                alt={`Gallery ${index + 1}`} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="services-section">
                <div className="services-card">
                    <h2>Services & Rates</h2>
                    
                    <div className="service-item">
                        <div className="service-header">
                            <span className="service-icon">👥</span>
                            <div className="service-title">
                                <h3>Talk & Greet</h3>
                                <p>Get to know each other first.</p>
                            </div>
                            <span className="price">Free</span>
                        </div>
                    </div>

                    <button className="contact-button" onClick={handleContact}>
                        CONTACT
                    </button>

                    <div className="service-item">
                        <div className="service-header">
                            <span className="service-icon">🏠</span>
                            <div className="service-title">
                                <h3>Pet Training</h3>
                                <div className="price-reservation">
                                    <span>From INR 15000 /course</span>
                                    <span className="reservation-text">MAKE RESERVATION</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="booking-info">
                        Book via Petbacker to enjoy <span className="premium">Premium Insurance</span>, 24/7 support, booking guarantee, safe cashless payments, photo updates and more!
                    </div>

                    <div className="payment-methods">
                        <img src={visa} alt="Visa" />
                        <img src={paypal} alt="PayPal" />
                        <img src={americanExpress} alt="American Express" />
                        <img src={mastercard} alt="Mastercard" />
                    </div>
                    <div className="badges-container">
                        <div className="badge-item">
                            <div className="badge-count">3</div>
                            <span className="badge-text">Completed<br />Bookings</span>
                        </div>
                        <div className="badge-item">
                            <img src={mobile} alt="Mobile" className="badge-icon" />
                            <span className="badge-text">Mobile</span>
                        </div>
                        <div className="badge-item">
                            <img src={email} alt="Email" className="badge-icon" />
                            <span className="badge-text">Email</span>
                        </div>
                        <div className="badge-item">
                            <img src={ids} alt="Id" className="badge-icon" />
                            <span className="badge-text">Id</span>
                        </div>
                        <div className="badge-item">
                            <img src={certification} alt="Certified" className="badge-icon" />
                            <span className="badge-text">Certified<br />Trainer</span>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default PetSitterProfile;    