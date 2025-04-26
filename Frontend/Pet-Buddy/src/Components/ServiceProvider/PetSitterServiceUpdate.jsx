import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaStar,
    FaHome,
    FaPhone,
    FaEnvelope,
    FaIdCard,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaCalendar,
    FaImages,
    FaClock
} from 'react-icons/fa';
import axios from 'axios';
import './PetSitterServiceUpdate.css';
import pro1 from '../../assets/pro1.jpg';
import pro11 from '../../assets/pro11.jpg';
import pro12 from '../../assets/pro12.jpg';
import pro13 from '../../assets/pro13.jpg';
import completed from '../../assets/completed-job.png';
import certification from '../../assets/certification.png';
import email from '../../assets/email.png';
import ids from '../../assets/id.png';
import mobile from '../../assets/mobile.png';
import visa from '../../assets/visa.png';
import mastercard from '../../assets/mastercard.png';
import paypal from '../../assets/paypal.png';
import americanExpress from '../../assets/americancard.png';

const PetSitterServiceUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/pet-services/${id}`);
            setProfile(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="profile-loading">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="profile-error">
                <p>{error || 'Profile not found'}</p>
            </div>
        );
    }

    const handleEdit = (cardId) => {
        navigate(`/create-listing/${cardId}`);
    };

    return (
        <div className="profile-container">
            <div className="left-column">
                <div className="profile-header">
                    <div className="profile-info">
                        <img
                            src={profile.base64Image ?
                                `data:image/jpeg;base64,${profile.base64Image}` :
                                profile.image || pro1}
                            alt="Profile"
                            className="PetSitterProfile-profile-image"
                        />
                        <div className="profile-content-wrapper">
                            <div className="title-row">
                                <h1>{profile.name}</h1>
                            </div>
                            <div className="author-row">
                                <span>by {profile.ownerName}</span>
                                <div className="rating">
                                    {[...Array(profile.rating)].map((_, i) => (
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
                    <span>{profile.location} | {profile.serviceType}</span>
                </div>

                <div className="main-section">
                    <h2>About the Service</h2>
                    <p className="description">{profile.description}</p>

                    {profile.base64MoreImages && profile.base64MoreImages.length > 0 && (
                        <div className="gallery-section">
                            <h3>
                                <FaImages className="gallery-icon" />
                                Service Gallery
                            </h3>
                            <div className="gallery-grid">
                                {profile.base64MoreImages.map((image, index) => (
                                    <div key={index} className="gallery-item">
                                        <img
                                            src={`data:image/jpeg;base64,${image}`}
                                            alt={`Service Image ${index + 1}`}
                                            className="gallery-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pet-types">
                        <h3>Pet Types Accepted:</h3>
                        <div className="pet-types-grid">
                            {profile.petTypes.map((type, index) => (
                                <span key={index} className="pet-type-tag">{type}</span>
                            ))}
                        </div>
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

                    <button
                        className="contact-button"
                        onClick={() => handleEdit(profile.id)}
                    >
                        Update
                    </button>


                    <div className="service-item">
                        <div className="service-header">
                            <span className="service-icon">🏠</span>
                            <div className="service-title">
                                <h3>{profile.serviceType}</h3>
                                <div className="price-reservation">
                                    <span>From ₹ {profile.price} /visit</span>
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
                            <div className="badge-count">{profile.completedBookings}</div>
                            <span className="badge-text">Completed<br />Bookings</span>
                        </div>
                        {profile.badges.map((badge, index) => (
                            <div key={index} className="badge-item">
                                <img
                                    src={badge === 'Certified' ? certification :
                                        badge === 'Top Rated' ? completed :
                                            badge === 'id' ? ids :
                                                badge === 'phone' ? mobile :
                                                    badge === 'email' ? email : null}
                                    alt={badge}
                                    className="badge-icon"
                                />
                                <span className="badge-text">{badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetSitterServiceUpdate;