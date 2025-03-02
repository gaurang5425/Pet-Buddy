import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactForm.css';
import { FaCalendar } from 'react-icons/fa';

const ContactForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        service: 'Daycare',
        petCount: '',
        petType: '',
        breed: '',
        size: '',
        additionalInfo: '',
        startDate: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Store form data in localStorage or state management
        localStorage.setItem('requestDetails', JSON.stringify(formData));
        navigate('/RequestSummary');
    };

    return (
        <div className="contact-form-container-outer">
            <div className="contact-form-container">
                <h2>Service Request Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Service Selected</label>
                        <select 
                            name="service" 
                            value={formData.service}
                            onChange={handleChange}
                            required
                        >
                            <option value="Daycare">Daycare</option>
                            <option value="Training">Training</option>
                            <option value="Boarding">Boarding</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>How many pets do you need to board?</label>
                        <input
                            type="number"
                            name="petCount"
                            value={formData.petCount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>What type of pet is it?</label>
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
                        </select>
                    </div>

                    <div className="form-group">
                        <label>What breed is it?</label>
                        <input
                            type="text"
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>What is the size of your pet?</label>
                        <select
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select size</option>
                            <option value="1-5kg">1-5kg</option>
                            <option value="5-10kg">5-10kg</option>
                            <option value="10-20kg">10-20kg</option>
                            <option value="20+kg">20+kg</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Anything else the sitter will need to know</label>
                        <textarea
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Please pick starting date of the service.</label>
                        <div className="date-input-container">
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                onClick={(e) => e.target.showPicker()}
                            />
                            <FaCalendar className="calendar-icon" />
                        </div>
                    </div>

                    <button type="submit" className="submit-button">Continue to Summary</button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm; 