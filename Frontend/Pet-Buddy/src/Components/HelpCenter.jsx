import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaUser, FaPaw, FaMoneyBillWave, FaShieldAlt, FaCog, FaHandshake, FaCalendarAlt, FaQuestionCircle } from 'react-icons/fa';
import "./HelpCenter.css";

const userFaqs = [
    {
        question: "How do I book a pet sitter?",
        answer: "To book a pet sitter, go to the Pet Sitters page, browse available sitters, select a profile, and click 'Book Now'. Follow the booking process to schedule your service."
    },
    {
        question: "What payment methods are accepted?",
        answer: "We accept all major credit/debit cards, UPI, and net banking. Payments are processed securely through our payment gateway."
    },
    {
        question: "How can I track my booking status?",
        answer: "You can track your booking status in the 'My Requests' section. Each booking shows its current status and history."
    },
    {
        question: "What if I need to cancel a booking?",
        answer: "You can cancel a booking through the 'My Requests' section. Cancellation policies vary based on the service type and timing."
    }
];

const sitterFaqs = [
    {
        question: "How do I become a pet sitter?",
        answer: "To become a pet sitter, complete your profile with required information, upload necessary documents, and wait for verification."
    },
    {
        question: "How do I manage my bookings?",
        answer: "Access your bookings through the 'My Bookings' section. You can view, accept, or decline requests and update booking status."
    },
    {
        question: "How do I receive payments?",
        answer: "Payments are processed automatically after service completion. You can view your earnings in the 'Earnings' section."
    },
    {
        question: "What insurance coverage do I have?",
        answer: "All verified pet sitters are covered under our insurance policy for the duration of their service."
    }
];

const categories = [
    { 
        title: "Booking & Payments", 
        icon: <FaCalendarAlt />,
        description: "Learn about booking process and payment options"
    },
    { 
        title: "Pet Sitters & Walkers", 
        icon: <FaPaw />,
        description: "Information about our service providers"
    },
    { 
        title: "Trust & Safety", 
        icon: <FaShieldAlt />,
        description: "Our safety measures and insurance coverage"
    },
    { 
        title: "Account & Settings", 
        icon: <FaCog />,
        description: "Manage your account and preferences"
    },
    { 
        title: "Earnings & Payments", 
        icon: <FaMoneyBillWave />,
        description: "Payment processing and earnings information"
    },
    { 
        title: "Support & Contact", 
        icon: <FaQuestionCircle />,
        description: "Get help and contact support"
    }
];

const HelpCenter = () => {
    const { currentUser } = useAuth();
    const [openIndex, setOpenIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Determine user role and FAQs
    const userRole = currentUser?.role || 'user';
    const faqs = userRole === 'sitter' ? sitterFaqs : userFaqs;

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSearchResults(true);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setShowSearchResults(false);
    };

    const filteredFaqs = searchQuery
        ? faqs.filter(faq => 
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : faqs;

    return (
        <div className="help-center-container">
            {/* Welcome Section */}
            <div className="help-welcome-section">
                <h1>Welcome to Pet-Buddy Help Center</h1>
                <p>Hello, {currentUser?.displayName || 'Guest'}! How can we assist you today?</p>
            </div>

            {/* Search Bar */}
            <div className="help-search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search for help topics..." 
                        className="help-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            {/* Categories */}
            <div className="help-categories">
                {categories.map((category, index) => (
                    <div 
                        key={index} 
                        className={`help-category-card ${selectedCategory?.title === category.title ? 'selected' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        <div className="category-icon">{category.icon}</div>
                        <h3>{category.title}</h3>
                        <p>{category.description}</p>
                    </div>
                ))}
            </div>

            {/* FAQs Section */}
            <div className="help-faq-section">
                <h2>Frequently Asked Questions</h2>
                {filteredFaqs.map((faq, index) => (
                    <div key={index} className="help-faq-item">
                        <button 
                            className={`help-faq-question ${openIndex === index ? 'open' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            {faq.question}
                            <span className="toggle-icon">{openIndex === index ? "▲" : "▼"}</span>
                        </button>
                        {openIndex === index && (
                            <div className="help-faq-answer">
                                <p>{faq.answer}</p>
                                <div className="faq-actions">
                                    <button className="helpful-btn">Was this helpful?</button>
                                    <button className="contact-btn">Contact Support</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="help-footer">
                <div className="footer-content">
                    <p>Need more help?</p>
                    <div className="footer-buttons">
                        <button className="contact-support-btn">Contact Support</button>
                        <button className="email-support-btn">Email Support</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HelpCenter;
