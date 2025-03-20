import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContactForm.css';
import { FaCalendar, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { useUser } from '../../context/UserContext.jsx';

const ContactForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = useUser();
    const [formData, setFormData] = useState({
        userName: userData?.name || '',
        owner: location.state?.owner || '',
        serviceSelected: location.state?.serviceSelected || '',
        numberOfPets: 1,
        petType: '',
        breed: '',
        size: '',
        additionalInfo: '',
        startDate: '',
        price: location.state?.price || 0,
        status: 'PENDING'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState({});
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (userData?.name) {
            setFormData(prev => ({
                ...prev,
                userName: userData.name
            }));
        }
    }, [userData]);

    // Calculate form completion progress
    useEffect(() => {
        const requiredFields = [
            'userName',
            'petType',
            'breed',
            'size',
            'startDate'
        ];
        
        const completedFields = requiredFields.filter(field => {
            const value = formData[field];
            return value !== '' && value !== null && value !== undefined;
        });
        
        const progressPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
        setProgress(progressPercentage);
    }, [formData]);

    const validateField = (name, value) => {
        switch (name) {
            case 'userName':
                return value.length >= 2 ? 'valid' : 'Name must be at least 2 characters long';
            case 'numberOfPets':
                return value > 0 && value <= 10 ? 'valid' : 'Number of pets must be between 1 and 10';
            case 'petType':
                return value !== '' ? 'valid' : 'Please select a pet type';
            case 'breed':
                return value.length >= 2 ? 'valid' : 'Please enter a valid breed';
            case 'size':
                return value !== '' ? 'valid' : 'Please select a pet size';
            case 'startDate':
                const selectedDate = new Date(value);
                const currentDate = new Date();
                // Remove any milliseconds for accurate comparison
                currentDate.setMilliseconds(0);
                selectedDate.setMilliseconds(0);
                return selectedDate > currentDate ?
                    'valid' :
                    'Please select a future date and time';
            default:
                return 'valid';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation
        const validationResult = validateField(name, value);
        setValidation(prev => ({
            ...prev,
            [name]: validationResult
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate all required fields
            const newValidation = {};
            let hasErrors = false;

            Object.keys(formData).forEach(key => {
                if (key !== 'owner' && key !== 'serviceSelected' && key !== 'price' && 
                    key !== 'status' && key !== 'additionalInfo') {
                    const value = formData[key];
                    const validationResult = validateField(key, value);
                    newValidation[key] = validationResult;
                    if (validationResult !== 'valid') {
                        hasErrors = true;
                    }
                }
            });

            setValidation(newValidation);

            if (hasErrors) {
                setError('Please fix the validation errors before submitting');
                setLoading(false);
                return;
            }

            // Format the data according to the backend model
            const requestData = {
                ...formData,
                id: Date.now(),
                numberOfPets: parseInt(formData.numberOfPets),
                price: parseFloat(formData.price)
            };

            const response = await axios.post('http://localhost:8080/api/services/requests', requestData);

            if (response.status === 201) {
                navigate('/RequestSummary', { 
                    state: { 
                        requestId: response.data.id
                    }
                });
            }
        } catch (err) {
            console.error('Error submitting request:', err);
            setError(err.response?.data?.message || 'Error submitting request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-form-container-outer">
            <div className="contact-form-container">
                <h2>Book Pet Service</h2>
                
                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-section">
                        <h3 className="form-section-title">Personal Information</h3>
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
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Service Details</h3>
                        <div className="form-group">
                            <label>Service Provider</label>
                            <input
                                type="text"
                                value={formData.owner}
                                disabled
                                className="disabled-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Service Selected</label>
                            <input
                                type="text"
                                value={formData.serviceSelected}
                                disabled
                                className="disabled-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                value={formData.price}
                                disabled
                                className="disabled-input"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Pet Information</h3>
                        <div className="form-group">
                            <label>Number of Pets *</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    name="numberOfPets"
                                    value={formData.numberOfPets}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    max="10"
                                    className={validation.numberOfPets === 'valid' ? 'valid' : validation.numberOfPets ? 'invalid' : ''}
                                />
                                {validation.numberOfPets === 'valid' && <FaCheck className="validation-icon valid" />}
                                {validation.numberOfPets && validation.numberOfPets !== 'valid' && (
                                    <FaExclamationCircle className="validation-icon invalid" />
                                )}
                            </div>
                            {validation.numberOfPets && validation.numberOfPets !== 'valid' && (
                                <span className="validation-message">{validation.numberOfPets}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Pet Type *</label>
                            <div className="input-container">
                                <select
                                    name="petType"
                                    value={formData.petType}
                                    onChange={handleChange}
                                    required
                                    className={validation.petType === 'valid' ? 'valid' : validation.petType ? 'invalid' : ''}
                                >
                                    <option value="">Select pet type</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Fish">Fish</option>
                                    <option value="Rabbit">Rabbit</option>
                                    <option value="Hamster">Hamster</option>
                                    <option value="Guinea Pig">Guinea Pig</option>
                                    <option value="Reptile">Reptile</option>
                                    <option value="Other">Other</option>
                                </select>
                                {validation.petType === 'valid' && <FaCheck className="validation-icon valid" />}
                                {validation.petType && validation.petType !== 'valid' && (
                                    <FaExclamationCircle className="validation-icon invalid" />
                                )}
                            </div>
                            {validation.petType && validation.petType !== 'valid' && (
                                <span className="validation-message">{validation.petType}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Pet Breed *</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter pet breed"
                                    className={validation.breed === 'valid' ? 'valid' : validation.breed ? 'invalid' : ''}
                                />
                                {validation.breed === 'valid' && <FaCheck className="validation-icon valid" />}
                                {validation.breed && validation.breed !== 'valid' && (
                                    <FaExclamationCircle className="validation-icon invalid" />
                                )}
                            </div>
                            {validation.breed && validation.breed !== 'valid' && (
                                <span className="validation-message">{validation.breed}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Pet Size *</label>
                            <div className="input-container">
                                <select
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    required
                                    className={validation.size === 'valid' ? 'valid' : validation.size ? 'invalid' : ''}
                                >
                                    <option value="">Select pet size</option>
                                    <option value="0-5kg">0-5kg</option>
                                    <option value="5-10kg">5-10kg</option>
                                    <option value="10-20kg">10-20kg</option>
                                    <option value="20-30kg">20-30kg</option>
                                    <option value="30kg+">30kg+</option>
                                </select>
                                {validation.size === 'valid' && <FaCheck className="validation-icon valid" />}
                                {validation.size && validation.size !== 'valid' && (
                                    <FaExclamationCircle className="validation-icon invalid" />
                                )}
                            </div>
                            {validation.size && validation.size !== 'valid' && (
                                <span className="validation-message">{validation.size}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Booking Details</h3>
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
                                    onFocus={(e) => e.target.showPicker()}
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

                        <div className="form-group">
                            <label>Additional Information</label>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Any special requirements or notes about your pet"
                                style={{ backgroundColor: "white" , color: "black" }} // Ensures white background
                            />

                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className={`submit-button ${loading ? 'submitting' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm; 