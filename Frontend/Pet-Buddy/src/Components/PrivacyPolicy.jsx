// PrivacyPolicy.jsx
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <h1>Privacy Policy</h1>

            <section className="privacy-section">
                <h2>1. Information We Collect</h2>
                <p>At Pet Buddy, we collect the following types of information:</p>
                <ul>
                    <li>Personal identification information (Name, email, phone number)</li>
                    <li>Pet information</li>
                    <li>Service preferences</li>
                    <li>Payment information</li>
                    <li>Location data</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                    <li>Provide and improve our services</li>
                    <li>Match you with pet care providers</li>
                    <li>Process payments</li>
                    <li>Send service notifications</li>
                    <li>Ensure platform safety</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>3. Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul>
                    <li>Pet care service providers</li>
                    <li>Payment processors</li>
                    <li>Legal authorities when required</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>4. Data Security</h2>
                <p>We protect your data through:</p>
                <ul>
                    <li>Encryption protocols</li>
                    <li>Secure data storage</li>
                    <li>Regular security audits</li>
                    <li>Access controls</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>5. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access your personal data</li>
                    <li>Request data correction</li>
                    <li>Delete your account</li>
                    <li>Opt-out of marketing communications</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>6. Cookie Policy</h2>
                <p>We use cookies to enhance your browsing experience and analyze site traffic.</p>
            </section>

            <div className="privacy-footer">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>For privacy concerns, contact: bhadanitirth@gmail.com</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;