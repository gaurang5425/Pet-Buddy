import React from 'react';
import './Home.css';

const App = () => {
    return (
        <div className="App">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Find Trusted Pet Sitters & Dog Walkers</h1>
                    <p>Connecting pet owners with pet care providers</p>
                    <button className="cta-button">Book Now</button>
                </div>
            </section>

            {/* Services Section */}
            <section className="services">
                <h2>Our Services</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <h3>Pet Sitting</h3>
                        <p>Professional pet sitters at your doorstep</p>
                    </div>
                    <div className="service-card">
                        <h3>Dog Walking</h3>
                        <p>Daily walks for your furry friend</p>
                    </div>
                    <div className="service-card">
                        <h3>Pet Boarding</h3>
                        <p>Safe and comfortable stay for your pet</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>What Our Clients Say</h2>
                <div className="testimonial-card">
                    <p>"Amazing service! My dog loved the sitter."</p>
                    <strong>- John Doe</strong>
                </div>
                <div className="testimonial-card">
                    <p>"Reliable and caring pet sitters, highly recommend!"</p>
                    <strong>- Jane Smith</strong>
                </div>
            </section>
        </div>
    );
};

export default App;
