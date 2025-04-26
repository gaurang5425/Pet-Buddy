import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContactForm.css';
import { FaCalendar, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { useUser } from '../../context/UserContext.jsx';

const ContactForm = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { userData } = useUser();
    const [validRequest, setValidRequest] = useState(true);

    const isUpdate = !!state?.id && validRequest;

    const [formData, setFormData] = useState({
        id: state?.id || '',
        userName: '',
        owner: state?.owner || '',
        serviceSelected: state?.serviceSelected || '',
        numberOfPets: 1,
        petType: '',
        breed: '',
        size: '',
        additionalInfo: '',
        startDate: '',
        price: state?.price || 0,
        status: state?.status || 'PENDING',
    });

    const [validation, setValidation] = useState({});
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load userName from context
    useEffect(() => {
        if (userData?.name) {
            setFormData(prev => ({ ...prev, userName: userData.name }));
        }
    }, [userData]);

    // Load existing request data for update
    useEffect(() => {
        const fetchRequest = async () => {
            if (state?.id) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/services/requests/${state.id}`);
                    if (res.status === 200) {
                        setFormData(prev => ({
                            ...res.data,
                            userName: userData?.name || res.data.userName
                        }));
                        setValidRequest(true);  // Mark as valid if data is fetched
                    }
                } catch (err) {
                    console.error('Failed to load request data:', err);
                    setValidRequest(false);  // Mark as invalid if fetch fails
                }
            }
        };
        fetchRequest();
    }, [state?.id, userData]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    // Update progress bar
    useEffect(() => {
        const required = ['userName', 'petType', 'breed', 'size', 'startDate'];
        const filled = required.filter(field => !!formData[field]);
        setProgress(Math.round((filled.length / required.length) * 100));
    }, [formData]);

    const validateField = (name, value) => {
        switch (name) {
            case 'userName':
                return value.length >= 2 ? 'valid' : 'Name must be at least 2 characters';
            case 'numberOfPets':
                return value > 0 && value <= 10 ? 'valid' : 'Number of pets must be 1–10';
            case 'petType':
                return value ? 'valid' : 'Select a pet type';
            case 'breed':
                return value.length >= 2 ? 'valid' : 'Enter a valid breed';
            case 'size':
                return value ? 'valid' : 'Select a pet size';
            case 'startDate':
                return new Date(value) > new Date() ? 'valid' : 'Choose a future date';
            default:
                return 'valid';
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidation(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const required = ['userName', 'numberOfPets', 'petType', 'breed', 'size', 'startDate'];
        const newValidation = {};
        let hasError = false;

        required.forEach(field => {
            const result = validateField(field, formData[field]);
            newValidation[field] = result;
            if (result !== 'valid') hasError = true;
        });

        setValidation(newValidation);

        if (hasError) {
            setError('Fix the errors before submitting.');
            setLoading(false);
            return;
        }

        try {
            const requestData = {
                ...formData,
                numberOfPets: Number(formData.numberOfPets),
                price: Number(formData.price),
            };

            const endpoint = isUpdate
                ? `http://localhost:8080/api/services/requests/${formData.id}`
                : 'http://localhost:8080/api/services/requests';

            const method = isUpdate ? axios.put : axios.post;
            if (!isUpdate) requestData.id = Date.now();

            const res = await method(endpoint, requestData);

            if (res.status === 200 || res.status === 201) {
                navigate('/RequestSummary', {
                    state: { requestId: requestData.id }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-form-container-outer">
            <div className="contact-form-container">
                <h2>{isUpdate ? 'Update Pet Service Request' : 'Book Pet Service'}</h2>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    {/* Personal Info */}
                    <section className="form-section">
                        <h3>Personal Information</h3>
                        <div className="form-group">
                            <label>Your Name</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    readOnly
                                    className="valid"
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                                <FaCheck className="validation-icon valid" />
                            </div>
                        </div>
                    </section>

                    {/* Service Info */}
                    <section className="form-section">
                        <h3>Service Details</h3>
                        {['owner', 'serviceSelected', 'price'].map(field => (
                            <div key={field} className="form-group">
                                <label>{field === 'owner' ? 'Service Provider' : field === 'price' ? 'Price' : 'Service Selected'}</label>
                                <input
                                    type={field === 'price' ? 'number' : 'text'}
                                    value={formData[field]}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                        ))}
                    </section>

                    {/* Pet Info */}
                    <section className="form-section">
                        <h3>Pet Information</h3>

                        {/* Number of Pets */}
                        <FormInput
                            label="Number of Pets *"
                            type="number"
                            name="numberOfPets"
                            min="1"
                            max="10"
                            value={formData.numberOfPets}
                            onChange={handleChange}
                            validation={validation.numberOfPets}
                        />

                        {/* Pet Type */}
                        <FormSelect
                            label="Pet Type *"
                            name="petType"
                            options={['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Guinea Pig', 'Reptile', 'Other']}
                            value={formData.petType}
                            onChange={handleChange}
                            validation={validation.petType}
                        />

                        {/* Breed */}
                        <FormInput
                            label="Pet Breed *"
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            placeholder="Enter pet breed"
                            validation={validation.breed}
                        />

                        {/* Size */}
                        <FormSelect
                            label="Pet Size *"
                            name="size"
                            options={['0-5kg', '5-10kg', '10-20kg', '20-30kg', '30kg+']}
                            value={formData.size}
                            onChange={handleChange}
                            validation={validation.size}
                        />
                    </section>

                    {/* Booking Info */}
                    <section className="form-section">
                        <h3>Booking Details</h3>

                        {/* Start Date */}
                        <div className="form-group">
                            <label>Start Date *</label>
                            <div className="input-container date-input-container">
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().slice(0, 16)}
                                    className={`date-input ${validation.startDate === 'valid' ? 'valid' : validation.startDate ? 'invalid' : ''}`}
                                />
                                <FaCalendar className="calendar-icon" />
                                {validation.startDate === 'valid' && <FaCheck className="validation-icon valid" />}
                                {validation.startDate && validation.startDate !== 'valid' && (
                                    <FaExclamationCircle className="validation-icon invalid" />
                                )}
                            </div>
                            {validation.startDate && validation.startDate !== 'valid' && (
                                <span className="validation-message">{validation.startDate}</span>
                            )}
                        </div>

                        {/* Additional Info */}
                        <div className="form-group">
                            <label>Additional Information</label>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Any special requirements or notes about your pet"
                            />
                        </div>
                    </section>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className={`submit-button ${loading ? 'submitting' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : isUpdate ? 'Update Request' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Reusable Input Component
const FormInput = ({ label, name, type = 'text', value, onChange, validation, ...props }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="input-container">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={validation === 'valid' ? 'valid' : validation ? 'invalid' : ''}
                {...props}
            />
            {validation === 'valid' && <FaCheck className="validation-icon valid" />}
            {validation && validation !== 'valid' && <FaExclamationCircle className="validation-icon invalid" />}
        </div>
        {validation && validation !== 'valid' && (
            <span className="validation-message">{validation}</span>
        )}
    </div>
);

// Reusable Select Component
const FormSelect = ({ label, name, options, value, onChange, validation }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="input-container">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={validation === 'valid' ? 'valid' : validation ? 'invalid' : ''}
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            {validation === 'valid' && <FaCheck className="validation-icon valid" />}
            {validation && validation !== 'valid' && <FaExclamationCircle className="validation-icon invalid" />}
        </div>
        {validation && validation !== 'valid' && (
            <span className="validation-message">{validation}</span>
        )}
    </div>
);

export default ContactForm;
