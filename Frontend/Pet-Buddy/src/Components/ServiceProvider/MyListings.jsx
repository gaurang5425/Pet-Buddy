import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.jsx';
import {Link, useNavigate} from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBed, FaHome, FaDog, FaBath, FaCar, FaPaw, FaCheckCircle, FaClock } from 'react-icons/fa';
import './MyListings.css';

const MyListings = () => {
    const { userData } = useUser();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getServiceIcon = (serviceType) => {
        switch (serviceType) {
            case 'Pet Boarding': return <FaBed />;
            case 'House Sitting': return <FaHome />;
            case 'Dog Walking': return <FaDog />;
            case 'Pet Daycare': return <FaPaw />;
            case 'Pet Grooming': return <FaBath />;
            case 'Pet Taxi': return <FaCar />;
            default: return <FaPaw />;
        }
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                if (!userData?.name) {
                    setError('User information not available');
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/pet-services/ownername/${encodeURIComponent(userData.name)}`);
                if (!response.ok) throw new Error('Failed to fetch listings');
                const data = await response.json();
                setListings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [userData?.name]);

    if (loading) {
        return (
            <div className="my-listings-container-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your listings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-listings-container">
                <div className="error-container">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button className="retry-button" onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const handleCardClick = (cardId) => {
        navigate(`/pet-sitter-update/${cardId}`);
    };

    return (
        <div className="my-listings-container">
            <div className="listings-header">
                <h1>My Listings</h1>
                <Link to="/create-listing" className="create-listing-btn">
                    <FaPlus /> Create New Listing
                </Link>
            </div>

            <div className="listings-grid">
                {listings.length === 0 ? (
                    <div className="no-listings-message">
                        <h2>No Listings Yet</h2>
                        <p>Start by creating your first pet service listing!</p>
                        <Link to="/create-listing" className="create-first-listing-btn">
                            Create Your First Listing
                        </Link>
                    </div>
                ) : (
                    listings.map((listing) => (
                        <div key={listing.id} className="listing-card" onClick={() => handleCardClick(listing.id)}>
                            <div className="listing-status-badge">
                                {listing.req_accepted === true ? (
                                    <span className="status accepted">
                                        <FaCheckCircle className="status-icon" />
                                    </span>
                                ) : (
                                    <span className="status pending">
                                        <FaClock className="status-icon" />
                                    </span>
                                )}
                            </div>

                            <div className="listing-image-container">
                                <img
                                    src={listing.base64Image ?
                                        `data:image/jpeg;base64,${listing.base64Image}` :
                                        listing.image || 'data:image/svg+xml;base64,...'
                                    }
                                    alt={listing.title}
                                    className="listing-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/svg+xml;base64,...';
                                    }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="listing-content">
                                <div className="listing-service-type">
                                    <span className="service-icon">{getServiceIcon(listing.serviceType)}</span>
                                    <span className="service-name">{listing.serviceType}</span>
                                </div>
                                <h3>{listing.title}</h3>
                                <p className="listing-price">₹{listing.price}</p>
                                <p className="listing-description">{listing.description}</p>
                                <div className="listing-details">
                                    <span className="location">City : {listing.location}</span>
                                    <span className="pet-types">{listing.petTypes.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyListings;
