// AboutUs.jsx
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About Pet Buddy</h1>
                <p>Your Trusted Partner in Pet Care Services</p>
            </div>

            <section className="about-section">
                <h2>Our Mission</h2>
                <p>At Pet Buddy, we're dedicated to connecting pet owners with reliable, passionate pet care providers. We understand that your pets are family members, and they deserve the best care possible.</p>
            </section>

            <section className="about-section values">
                <h2>Our Values</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <h3>Trust</h3>
                        <p>We prioritize building trust through thorough vetting of our service providers.</p>
                    </div>
                    <div className="value-card">
                        <h3>Quality</h3>
                        <p>We maintain high standards in all our pet care services.</p>
                    </div>
                    <div className="value-card">
                        <h3>Safety</h3>
                        <p>Your pet's safety and well-being are our top priorities.</p>
                    </div>
                    <div className="value-card">
                        <h3>Care</h3>
                        <p>We treat every pet with the love and attention they deserve.</p>
                    </div>
                </div>
            </section>

            <section className="about-section values">
                <h2>What We Offer</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <h3>Pet Sitting</h3>
                        <p>Professional in-home pet care while you're away.</p>
                    </div>
                    <div className="value-card">
                        <h3>Dog Walking</h3>
                        <p>Regular exercise and outdoor activities for your dogs.</p>
                    </div>
                    <div className="value-card">
                        <h3>Pet Grooming</h3>
                        <p>Complete grooming services for all types of pets.</p>
                    </div>
                    <div className="value-card">
                        <h3>Pet Training</h3>
                        <p>Professional training sessions for better behavior.</p>
                    </div>
                </div>
            </section>

            <section className="about-section team">
                <h2>Why Choose Us</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h3>Experienced Team</h3>
                        <p>Our team consists of certified and experienced pet care professionals.</p>
                    </div>
                    <div className="feature">
                        <h3>24/7 Support</h3>
                        <p>We're always here to assist you with your pet care needs.</p>
                    </div>
                    <div className="feature">
                        <h3>Flexible Booking</h3>
                        <p>Easy online booking system that works around your schedule.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;