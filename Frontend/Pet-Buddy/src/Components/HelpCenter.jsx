import React, { useState } from "react";
import "./HelpCenter.css";

const faqs = [
    {
        question: "How do I book a pet sitter?",
        answer: "To book a pet sitter, simply search for available sitters, select a profile, and click on the 'Book Now' button."
    },
    {
        question: "What payment methods are accepted?",
        answer: "We accept credit/debit cards, PayPal, and other online payment options."
    },
    {
        question: "How can I contact support?",
        answer: "You can contact support through the Help Center or email us at support@petbacker.com."
    }
];

const categories = [
    { title: "Booking & Payments", icon: "💳" },
    { title: "Pet Sitters & Walkers", icon: "🐶" },
    { title: "Trust & Safety", icon: "🛡️" },
    { title: "Account & Settings", icon: "⚙️" },
];

const HelpCenter = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="help-center-container">
            {/* Search Bar */}
            <div className="help-search-section">
                <h2>How can we help you?</h2>
                <input type="text" placeholder="Search for help topics..." className="help-search-input" />
            </div>

            {/* Categories */}
            <div className="help-categories">
                {categories.map((category, index) => (
                    <div key={index} className="help-category-card">
                        <span className="help-category-icon">{category.icon}</span>
                        <h3>{category.title}</h3>
                    </div>
                ))}
            </div>

            {/* FAQs Section */}
            <div className="help-faq-section">
                <h2>Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="help-faq-item">
                        <button className="help-faq-question" onClick={() => toggleFAQ(index)}>
                            {faq.question} {openIndex === index ? "▲" : "▼"}
                        </button>
                        {openIndex === index && <p className="help-faq-answer">{faq.answer}</p>}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="help-footer">
                Need more help? <a href="/contact">Contact Support</a>
            </footer>
        </div>
    );
};

export default HelpCenter;
