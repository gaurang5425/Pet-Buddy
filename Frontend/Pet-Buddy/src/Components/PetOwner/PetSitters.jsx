import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PetSitters.css';
import { FaBed, FaHome, FaDog, FaBath, FaCar, FaPaw, FaStar, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import id from '../../assets/id.png';
import phoneBadge from '../../assets/mobile.png';
import emailBadge from '../../assets/email.png';
import documentBadge from '../../assets/certification.png';
import verifiedBadge from '../../assets/sitter_intro_verified.png';

const PetSitters = () => {
    const [location, setLocation] = useState("");
    const [selectedService, setSelectedService] = useState("Pet Boarding");
    const [selectedPetType, setSelectedPetType] = useState("All Pets");
    const [sortBy, setSortBy] = useState("recommended");
    const [petSitterCards, setPetSitterCards] = useState([]);
    const [originalPetSitters, setOriginalPetSitters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const services = [
        { id: 1, name: 'Pet Boarding', icon: <FaBed />, color: '#8865c1' },
        { id: 2, name: 'House Sitting', icon: <FaHome />, color: '#8865c1' },
        { id: 3, name: 'Dog Walking', icon: <FaDog />, color: '#8865c1' },
        { id: 4, name: 'Pet Daycare', icon: <FaPaw />, color: '#8865c1' },
        { id: 5, name: 'Pet Grooming', icon: <FaBath />, color: '#8865c1' },
        { id: 6, name: 'Pet Taxi', icon: <FaCar />, color: '#8865c1' }
    ];

    const petTypes = [
        "All Pets", "Dog", "Cat", "Bird", "Fish", "Rabbit",
        "Hamster", "Guinea Pig", "Reptile", "Other"
    ];

    const badgeImages = {
        'Certified': documentBadge,
        'Top Rated': verifiedBadge,
        'id': id,
        'phone': phoneBadge,
        'email': emailBadge,
    };

    useEffect(() => {
        fetchPetSitters();
    }, []);

    useEffect(() => {
        filterPetSitters();
    }, [location, selectedService, selectedPetType, sortBy, originalPetSitters]);

    const fetchPetSitters = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/pet-services');

            if (!response.data) {
                throw new Error('No data received from API');
            }

            setOriginalPetSitters(response.data);
            setPetSitterCards(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching pet sitters:', err);
            setError(err.response?.data?.message || 'Error fetching pet sitters');
            setLoading(false);
            setPetSitterCards([]);
            setOriginalPetSitters([]);
        }
    };

    const filterPetSitters = () => {
        let filtered = [...originalPetSitters];

        // Filter by service type
        filtered = filtered.filter(card => card.serviceType === selectedService);

        // Filter by pet type
        if (selectedPetType !== "All Pets") {
            filtered = filtered.filter(card => card.petTypes.includes(selectedPetType));
        }

        // Filter by location
        if (location.trim()) {
            filtered = filtered.filter(card =>
                card.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        // Sort filtered results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    return b.rating === a.rating ? b.reviews - a.reviews : b.rating - a.rating;
                default: // "recommended"
                    return ((b.rating * 0.6) + (b.reviews * 0.4)) - ((a.rating * 0.6) + (a.reviews * 0.4));
            }
        });

        setPetSitterCards(filtered);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

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

    // Calculate totals based on filtered cards
    const totalReviews = petSitterCards.reduce((sum, card) => sum + card.reviews, 0);
    const averageRating = petSitterCards.length > 0
        ? petSitterCards.reduce((sum, card) => sum + card.rating, 0) / petSitterCards.length
        : 0;

    return (
        <div className="pet-sitters-container">
            <div className="pet-sitters-hero-content">
                <div className="pet-sitters-hero-text">
                    <h2>Compare <span className="pet-sitters-highlight">Pet Sitters</span> services</h2>
                    <h2>near you for the best Pet Sitters prices</h2>
                    <p>Get the 5 best nearby Pet Sitters with just one request.</p>
                    <button className="pet-sitters-quote-button" disabled>Get 5 Best Quotes</button>
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
                                onChange={handleLocationChange}
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
                {petSitterCards.length > 0 ? (
                    <>
                        <div className="pet-sitters-results-header">
                            <div className="pet-sitters-results-title">
                                <span className="pet-sitters-highlight">Scroll down</span> to browse {petSitterCards.length} {selectedService}
                                {selectedPetType !== "All Pets" ? ` for ${selectedPetType}s` : ''}
                                {location ? ` near ${location}` : ''}
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
                            {petSitterCards.map((card) => (
                                <div
                                    key={card.id}
                                    className="pet-sitters-card"
                                    onClick={() => handleCardClick(card.id)}
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
                                                badgeImages[badge] && (
                                                    <img
                                                        key={index}
                                                        src={badgeImages[badge]}
                                                        alt={`${badge} badge`}
                                                        className="pet-sitters-badge-icon"
                                                    />
                                                )
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
                                {selectedPetType !== "All Pets" ? ` for ${selectedPetType}s` : ''}
                                {location ? ` in ${location}` : ''}.</p>
                            <p>Try changing your filters or location to see more results.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetSitters;