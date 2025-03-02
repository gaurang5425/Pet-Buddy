import React from 'react';
import './PetSitters.css';
import { FaBed, FaHome, FaDog, FaBath, FaCar, FaPaw, FaStar, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import pro11 from '../assets/pro11.jpg';
import id from '../assets/id.png';
import phoneBadge from '../assets/mobile.png';
import emailBadge from '../assets/email.png';
import documentBadge from '../assets/certification.png';
import verifiedBadge from '../assets/sitter_intro_verified.png';

const PetSitters = () => {
    const [location, setLocation] = React.useState("Ahmedabad, Gujarat, India");
    const [selectedService, setSelectedService] = React.useState("Pet Boarding");
    const [selectedPetType, setSelectedPetType] = React.useState("All Pets");
    const [sortBy, setSortBy] = React.useState("recommended");
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

    const petSitterCards = [
        {
            id: 1,
            name: "All Good Dogs - Training And Boarding",
            ownerName: "Raj Patel",
            location: "Ahmedabad, Gujarat",
            distance: "2.31 Km.",
            description: "Hello Guys, with hands on previous experience and genuine love for pets...",
            rating: 5,
            reviews: 6,
            completedBookings: 3,
            price: 500,
            image: pro11,//get image from database
            badges: ["id", "phone", "email", "document", "verified"],
            serviceType: "Pet Boarding",
            petTypes: ["Dog", "Cat"]
        },
        {
            id: 2,
            name: "Pet Paradise",
            ownerName: "Priya Shah",
            location: "Ahmedabad, Gujarat",
            distance: "3.5 Km.",
            description: "Professional pet boarding with 24/7 care...",
            rating: 4,
            reviews: 8,
            completedBookings: 5,
            price: 600,
            image: pro11,
            badges: ["id", "phone", "email", "verified"],
            serviceType: "Pet Boarding",
            petTypes: ["Dog", "Cat", "Bird"]
        },
        {
            id: 3,
            name: "Home Pet Care",
            ownerName: "Amit Desai",
            location: "Ahmedabad, Gujarat",
            distance: "4.2 Km.",
            description: "Professional house sitting services...",
            rating: 5,
            reviews: 10,
            completedBookings: 7,
            price: 450,
            image: pro11,
            badges: ["id", "phone", "email", "verified"],
            serviceType: "House Sitting",
            petTypes: ["Cat", "Fish", "Bird"]
        },
        {
            id: 4,
            name: "Happy Walks",
            ownerName: "Meera Joshi",
            location: "Ahmedabad, Gujarat",
            distance: "2.8 Km.",
            description: "Professional dog walking services...",
            rating: 5,
            reviews: 12,
            completedBookings: 15,
            price: 300,
            image: pro11,
            badges: ["id", "phone", "email", "verified"],
            serviceType: "Dog Walking",
            petTypes: ["Dog"]
        },
        // Add more cards for each service type...
    ];

    // Create a badge mapping object
    const badgeImages = {
        'id': id,
        'phone': phoneBadge,
        'email': emailBadge,
        'document': documentBadge,
        'verified': verifiedBadge
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
                // Sort by rating first, then by number of reviews if ratings are equal
                if (b.rating === a.rating) {
                    return b.reviews - a.reviews;
                }
                return b.rating - a.rating;
            default: // "recommended"
                // Sort by rating and reviews combined
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
                                        <img src={card.image} alt={card.name} />
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
                                                    <FaStar key={index} className="pet-sitters-star-icon" />
                                                ))}
                                                <span>{card.reviews} Reviews</span>
                                            </div>
                                            <div className="pet-sitters-bookings">
                                                <FaCalendar className="pet-sitters-calendar-icon" />
                                                <span>{card.completedBookings} Completed Bookings</span>
                                            </div>
                                            <div className="pet-sitters-price">
                                                <span>From</span>
                                                <strong>INR {card.price}</strong>
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