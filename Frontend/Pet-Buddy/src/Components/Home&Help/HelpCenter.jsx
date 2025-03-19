import React, { useState } from "react";
import { useUser } from '../../context/UserContext.jsx';
import { FaUser, FaPaw, FaMoneyBillWave, FaShieldAlt, FaCog, FaHandshake, FaCalendarAlt, FaQuestionCircle } from 'react-icons/fa';
import "./HelpCenter.css";

const ownerFaqs = {
    "Booking & Payments": [
        {
            question: "How do I manage my service listings?",
            answer: "Go to your dashboard and click on 'My Services'. Here you can add, edit, or remove your service listings."
        },
        {
            question: "How do I set my service prices?",
            answer: "In your service listing, you can set base prices and customize rates for different service durations."
        }
    ],
    "Pet Sitters & Walkers": [
        {
            question: "How do I verify my credentials?",
            answer: "Upload your professional certifications and documents through your profile settings."
        },
        {
            question: "How do I manage my availability?",
            answer: "Use the calendar in your dashboard to set your working hours and mark unavailable dates."
        }
    ],
    "Trust & Safety": [
        {
            question: "What insurance coverage do I have?",
            answer: "As a verified service provider, you're covered under our comprehensive insurance policy."
        },
        {
            question: "How do I handle emergency situations?",
            answer: "Contact our 24/7 support line immediately. We have protocols in place for various emergency scenarios."
        }
    ]
};

const userFaqs = {
    "Booking & Payments": [
        {
            question: "How do I book a service?",
            answer: "Browse available services, select a provider, choose your preferred date and time, and complete the booking process."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept all major credit/debit cards, UPI, and net banking. Payments are processed securely."
        }
    ],
    "Pet Sitters & Walkers": [
        {
            question: "How do I find the right service provider?",
            answer: "Browse provider profiles, read reviews, and check their experience and ratings to make an informed choice."
        },
        {
            question: "What information should I provide about my pet?",
            answer: "Include your pet's age, breed, special needs, and any behavioral information in your booking request."
        }
    ],
    "Trust & Safety": [
        {
            question: "How is my pet's safety ensured?",
            answer: "All service providers are verified, insured, and trained in pet safety protocols."
        },
        {
            question: "What happens in case of emergencies?",
            answer: "Our service providers are trained to handle emergencies and have direct access to veterinary support."
        }
    ]
};

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
    }
];

const HelpCenter = () => {
    const { userData } = useUser();
    const [openIndex, setOpenIndex] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Booking & Payments");

    // Determine user role and FAQs
    const isOwner = userData?.role === 'OWNER';
    const faqs = isOwner ? ownerFaqs : userFaqs;
    const currentFaqs = faqs[selectedCategory] || [];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.title);
        setOpenIndex(null); // Reset open FAQ when changing category
    };

    return (
        <div className="help-center-container">
            {/* Welcome Section */}
            <div className="help-welcome-section">
                <h1>Welcome to Pet-Buddy Help Center</h1>
                <p>Hello, {userData?.name || 'Guest'}! How can we assist you today?</p>
            </div>

            {/* Categories */}
            <div className="help-categories">
                {categories.map((category, index) => (
                    <div 
                        key={index} 
                        className={`help-category-card ${selectedCategory === category.title ? 'selected' : ''}`}
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
                <h2>{selectedCategory} - Frequently Asked Questions</h2>
                {currentFaqs.map((faq, index) => (
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
