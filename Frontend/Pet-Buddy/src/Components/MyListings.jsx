import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBed, FaHome, FaDog, FaBath, FaCar, FaPaw } from 'react-icons/fa';
import './MyListings.css';

const MyListings = () => {
    const { userData } = useUser();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getServiceIcon = (serviceType) => {
        switch (serviceType) {
            case 'Pet Boarding':
                return <FaBed />;
            case 'House Sitting':
                return <FaHome />;
            case 'Dog Walking':
                return <FaDog />;
            case 'Pet Daycare':
                return <FaPaw />;
            case 'Pet Grooming':
                return <FaBath />;
            case 'Pet Taxi':
                return <FaCar />;
            default:
                return <FaPaw />;
        }
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                if (!userData?.name) {
                    setError('User information not available');
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/pet-services/ownername/${encodeURIComponent(userData.name)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch listings');
                }
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
                        <div key={listing.id} className="listing-card">
                            <div className="listing-image-container">
                                <img 
                                    src={listing.base64Image ? 
                                        `data:image/jpeg;base64,${listing.base64Image}` : 
                                        listing.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
                                    }
                                    alt={listing.title} 
                                    className="listing-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                                    }}
                                    loading="lazy"
                                />
                                {/*<div className="listing-actions">*/}
                                {/*    <button className="action-btn edit-btn">*/}
                                {/*        <FaEdit />*/}
                                {/*    </button>*/}
                                {/*    <button className="action-btn delete-btn">*/}
                                {/*        <FaTrash />*/}
                                {/*    </button>*/}
                                {/*</div>*/}
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
                                    <span className="location">{listing.location}</span>
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