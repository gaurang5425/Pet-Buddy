import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PetSitters.css';
import { FaBed, FaHome, FaDog, FaBath, FaCar, FaPaw, FaStar, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import id from '../assets/id.png';
import phoneBadge from '../assets/mobile.png';
import emailBadge from '../assets/email.png';
import documentBadge from '../assets/certification.png';
import verifiedBadge from '../assets/sitter_intro_verified.png';

const PetSitters = () => {
    const [location, setLocation] = useState("Ahmedabad, Gujarat, India");
    const [selectedService, setSelectedService] = useState("Pet Boarding");
    const [selectedPetType, setSelectedPetType] = useState("All Pets");
    const [sortBy, setSortBy] = useState("recommended");
    const [petSitterCards, setPetSitterCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPetSitters();
    }, []);

    const fetchPetSitters = async () => {
        try {
            console.log('Starting to fetch pet sitters...');
            
            const response = await axios.get('http://localhost:8080/api/pet-services');
            
            console.log('API Response:', response.data);
            
            if (!response.data) {
                console.log('No data received from API');
                throw new Error('No data received from API');
            }

            // Log the first card's image data to debug
            if (response.data.length > 0) {
                console.log('First card image data:', {
                    base64Image: response.data[0].base64Image,
                    image: response.data[0].image
                });
            }

            setPetSitterCards(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching pet sitters:', err);
            setError(err.response?.data?.message || 'Error fetching pet sitters');
            setLoading(false);
            setPetSitterCards([]);
        }
    };

    const services = [
        { id: 1, name: 'Pet Boarding', icon: <FaBed />, color: '#8865c1' },
        { id: 2, name: 'House Sitting', icon: <FaHome />, color: '#8865c1' },
        { id: 3, name: 'Dog Walking', icon: <FaDog />, color: '#8865c1' },
        { id: 4, name: 'Pet Daycare', icon: <FaPaw />, color: '#8865c1' },
        { id: 5, name: 'Pet Grooming', icon: <FaBath />, color: '#8865c1' },
        { id: 6, name: 'Pet Taxi', icon: <FaCar />, color: '#8865c1' }
    ];

    const petTypes = [
        "All Pets",
        "Dog",
        "Cat",
        "Bird",
        "Fish",
        "Rabbit",
        "Hamster",
        "Guinea Pig",
        "Reptile",
        "Other"
    ];

    // Create a badge mapping object
    const badgeImages = {
        'Certified': documentBadge,
        'Top Rated': verifiedBadge,
        'id': id,
        'phone': phoneBadge,
        'email': emailBadge,
    };

    // Filter cards based on both service type and pet type
    const filteredCards = petSitterCards.filter(card => {
        const serviceMatch = card.serviceType === selectedService;
        const petTypeMatch = selectedPetType === "All Pets" || card.petTypes.includes(selectedPetType);
        return serviceMatch && petTypeMatch;
    });

    // Sort filtered cards
    const sortedCards = [...filteredCards].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "rating":
                if (b.rating === a.rating) {
                    return b.reviews - a.reviews;
                }
                return b.rating - a.rating;
            default: // "recommended"
                const scoreA = (a.rating * 0.6) + (a.reviews * 0.4);
                const scoreB = (b.rating * 0.6) + (b.reviews * 0.4);
                return scoreB - scoreA;
        }
    });

    // Calculate totals based on filtered cards only
    const totalReviews = filteredCards.reduce((sum, card) => sum + card.reviews, 0);
    const averageRating = filteredCards.length > 0 
        ? filteredCards.reduce((sum, card) => sum + card.rating, 0) / filteredCards.length 
        : 0;

    const handleCardClick = (cardId) => {
        navigate(`/pet-sitter/${cardId}`);
    };

    if (loading) {
        return (
            <div className="pet-sitters-loading">
                <FaPaw className="pet-sitters-loading-icon" />
                <p>Loading pet sitters...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pet-sitters-error">
                <FaPaw className="pet-sitters-error-icon" />
                <p>Error: {error}</p>
                <button onClick={fetchPetSitters}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="pet-sitters-container">
            <div className="pet-sitters-hero-content">
                <div className="pet-sitters-hero-text">
                    <h2>Compare <span className="pet-sitters-highlight">Pet Sitters</span> services</h2>
                    <h2>near you for the best Pet Sitters prices</h2>
                    <p>Get the 5 best nearby Pet Sitters with just one request.</p>
                    <button className="pet-sitters-quote-button">Get 5 Best Quotes</button>
                </div>

                <div className="pet-sitters-search-form">
                    <div className="pet-sitters-form-header">I am looking for</div>
                    <div className="pet-sitters-services-grid">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                className={`pet-sitters-service-button ${selectedService === service.name ? 'active' : ''}`}
                                onClick={() => setSelectedService(service.name)}
                            >
                                <span className="pet-sitters-service-icon" style={{ color: service.color }}>
                                    {service.icon}
                                </span>
                                <span className="pet-sitters-service-name">{service.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="pet-sitters-search-inputs">
                        <div className="pet-sitters-location-field">
                            <label>Near me in</label>
                            <input
                                type="text"
                                placeholder="Enter your location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="pet-sitters-pet-type-field">
                            <label>My pet type</label>
                            <select 
                                value={selectedPetType}
                                onChange={(e) => setSelectedPetType(e.target.value)}
                            >
                                {petTypes.map((petType, index) => (
                                    <option key={index} value={petType}>
                                        {petType}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pet-sitters-results-section">
                {sortedCards.length > 0 ? (
                    <>
                        <div className="pet-sitters-results-header">
                            <div className="pet-sitters-results-title">
                                <span className="pet-sitters-highlight">Scroll down</span> to browse {sortedCards.length} {selectedService} 
                                {selectedPetType !== "All Pets" ? ` for ${selectedPetType}s` : ''} near you in {location}
                            </div>
                            <div className="pet-sitters-sort-dropdown">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="recommended">Sort by: Recommended</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        </div>

                        <div className="pet-sitters-overall-rating">
                            {[...Array(5)].map((_, index) => (
                                <FaStar 
                                    key={index} 
                                    className="pet-sitters-star-icon" 
                                    style={{ color: index < Math.round(averageRating) ? '#ffd700' : '#e0e0e0' }}
                                />
                            ))}
                            <span>{totalReviews} Reviews</span>
                        </div>

                        <div className="pet-sitters-cards-container">
                            {sortedCards.map((card) => (
                                <div 
                                    key={card.id} 
                                    className="pet-sitters-card"
                                    onClick={() => handleCardClick(card.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="pet-sitters-card-image">
                                        <img 
                                            src={card.base64Image ? 
                                                `data:image/jpeg;base64,${card.base64Image}` : 
                                                card.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
                                            } 
                                            alt={card.name} 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                                            }}
                                        />
                                    </div>
                                    <div className="pet-sitters-card-content">
                                        <div className="pet-sitters-badge-container">
                                            {card.badges.map((badge, index) => (
                                                badgeImages[badge] ? (
                                                    <img
                                                        key={index}
                                                        src={badgeImages[badge]}
                                                        alt={`${badge} badge`}
                                                        className="pet-sitters-badge-icon"
                                                    />
                                                ) : null
                                            ))}
                                        </div>
                                        <h3>{card.name}</h3>
                                        <p className="pet-sitters-location">
                                            {card.location} <span className="pet-sitters-distance">{card.distance}</span>
                                        </p>
                                        <p className="pet-sitters-description">{card.description}</p>
                                        <div className="pet-sitters-card-footer">
                                            <div className="pet-sitters-rating">
                                                {[...Array(5)].map((_, index) => (
                                                    <FaStar 
                                                        key={index} 
                                                        className="pet-sitters-star-icon"
                                                        style={{ color: index < card.rating ? '#ffd700' : '#e0e0e0' }}
                                                    />
                                                ))}
                                                <span>{card.reviews} Reviews</span>
                                            </div>
                                            <div className="pet-sitters-bookings">
                                                <FaCalendar className="pet-sitters-calendar-icon" />
                                                <span>{card.completedBookings} Completed Bookings</span>
                                            </div>
                                            <div className="pet-sitters-price">
                                                <span>From</span>
                                                <strong>${card.price}</strong>
                                                <span>/visit</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="pet-sitters-no-results">
                        <div className="pet-sitters-no-results-content">
                            <FaPaw className="pet-sitters-no-results-icon" />
                            <h3>No Pet Sitters Available</h3>
                            <p>Sorry, we couldn't find any {selectedService} services 
                               {selectedPetType !== "All Pets" ? ` for ${selectedPetType}s` : ''} in {location}.</p>
                            <p>Try changing your filters or location to see more results.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetSitters;