import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContactForm.css';
import { FaCalendar } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

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
        status: 'pending'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userData?.name) {
            setFormData(prev => ({
                ...prev,
                userName: userData.name
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.userName || !formData.petType || !formData.breed || 
                !formData.size || !formData.startDate) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Format the data according to the backend model
            const requestData = {
                ...formData,
                id: Date.now(), // Generate a unique ID using timestamp
                numberOfPets: parseInt(formData.numberOfPets),
                price: parseFloat(formData.price)
            };

            console.log('Submitting request data:', requestData);
            const response = await axios.post('http://localhost:8080/api/services/requests', requestData);

            console.log('Response:', response.data);
            if (response.status === 201) {
                // Send the request ID to the next page
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
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-section">
                        <h3 className="form-section-title">Personal Information</h3>
                        <div className="form-group">
                            <label>Your Name *</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                            />
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
                            <input
                                type="number"
                                name="numberOfPets"
                                value={formData.numberOfPets}
                                onChange={handleChange}
                                required
                                min="1"
                                max="10"
                            />
                        </div>

                        <div className="form-group">
                            <label>Pet Type *</label>
                            <select
                                name="petType"
                                value={formData.petType}
                                onChange={handleChange}
                                required
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
                        </div>

                        <div className="form-group">
                            <label>Pet Breed *</label>
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                required
                                placeholder="Enter pet breed"
                            />
                        </div>

                        <div className="form-group">
                            <label>Pet Size *</label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select pet size</option>
                                <option value="0-5kg">0-5kg</option>
                                <option value="5-10kg">5-10kg</option>
                                <option value="10-20kg">10-20kg</option>
                                <option value="20-30kg">20-30kg</option>
                                <option value="30kg+">30kg+</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Booking Details</h3>
                        <div className="form-group">
                            <label>Start Date *</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

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
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className="submit-button"
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