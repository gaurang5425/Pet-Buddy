import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import './MyListings.css';

const MyListings = () => {
    const { userData } = useUser();

    return (
        <div className="my-listings-container">
            <div className="listings-header">
                <h1>My Listings</h1>
                <Link to="/create-listing" className="create-listing-btn">
                    <FaPlus /> Create New Listing
                </Link>
            </div>
            
            <div className="listings-grid">
                {/* Placeholder for listings */}
                <div className="no-listings-message">
                    <p>You haven't created any listings yet.</p>
                    <p>Start by creating your first pet service listing!</p>
                </div>
            </div>
        </div>
    );
};

export default MyListings; 