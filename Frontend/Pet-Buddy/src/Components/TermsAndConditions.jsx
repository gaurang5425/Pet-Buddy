// TermsAndConditions.jsx
import './TermsAndConditions.css';

const TermsAndConditions = () => {
    return (
        <div className="terms-container">
            <h1>Terms and Conditions</h1>

            <section className="terms-section">
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using Pet Buddy services, you agree to be bound by these terms and conditions.</p>
            </section>

            <section className="terms-section">
                <h2>2. Service Description</h2>
                <p>Pet Buddy provides a platform connecting pet owners with pet care service providers.</p>
                <ul>
                    <li>Pet sitting services</li>
                    <li>Dog walking</li>
                    <li>Pet grooming</li>
                    <li>Pet boarding</li>
                </ul>
            </section>

            <section className="terms-section">
                <h2>3. User Obligations</h2>
                <p>Users must:</p>
                <ul>
                    <li>Provide accurate information</li>
                    <li>Maintain account security</li>
                    <li>Comply with local laws and regulations</li>
                    <li>Treat service providers with respect</li>
                </ul>
            </section>

            <section className="terms-section">
                <h2>4. Service Provider Requirements</h2>
                <p>Service providers must:</p>
                <ul>
                    <li>Provide accurate service descriptions</li>
                    <li>Maintain required licenses and certifications</li>
                    <li>Carry appropriate insurance</li>
                    <li>Follow safety guidelines</li>
                </ul>
            </section>

            <section className="terms-section">
                <h2>5. Payment Terms</h2>
                <p>Details about payment processing, refunds, and cancellation policies.</p>
            </section>

            <section className="terms-section">
                <h2>6. Liability</h2>
                <p>Information about service guarantees, insurance coverage, and liability limitations.</p>
            </section>

            <div className="terms-footer">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>For questions about these terms, please contact bhadanitirth@gmail.com</p>
            </div>
        </div>
    );
};

export default TermsAndConditions;