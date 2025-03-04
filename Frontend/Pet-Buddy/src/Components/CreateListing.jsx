import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUpload, FaTimes } from 'react-icons/fa';
import './CreateListing.css';

const CreateListing = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        location: '',
        distance: '',
        description: '',
        rating: 5,
        reviews: 0,
        completedBookings: 0,
        price: '',
        serviceType: '',
        petTypes: [],
        badges: ['Certified', 'Top Rated'],
        image: null,
        base64Image: '',
        moreImages: [],
        base64MoreImages: []
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [previewMoreImages, setPreviewMoreImages] = useState([]);
    const [error, setError] = useState('');

    const serviceTypes = [
        'Pet Boarding',
        'House Sitting',
        'Dog Walking',
        'Pet Daycare',
        'Pet Grooming',
        'Pet Taxi',
        'Pet Training'
    ];

    const petTypes = [
        'Dog',
        'Cat',
        'Bird',
        'Fish',
        'Rabbit',
        'Hamster',
        'Guinea Pig',
        'Reptile',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePetTypeChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            petTypes: checked 
                ? [...prev.petTypes, value]
                : prev.petTypes.filter(type => type !== value)
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData(prev => ({
                    ...prev,
                    base64Image: reader.result.split(',')[1]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMoreImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                moreImages: files
            }));

            const newPreviews = [];
            const newBase64Images = [];

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    newBase64Images.push(reader.result.split(',')[1]);
                    
                    if (newPreviews.length === files.length) {
                        setPreviewMoreImages(newPreviews);
                        setFormData(prev => ({
                            ...prev,
                            base64MoreImages: newBase64Images
                        }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeMainImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            base64Image: ''
        }));
        setPreviewImage(null);
    };

    const removeMoreImage = (index) => {
        setFormData(prev => ({
            ...prev,
            moreImages: prev.moreImages.filter((_, i) => i !== index),
            base64MoreImages: prev.base64MoreImages.filter((_, i) => i !== index)
        }));
        setPreviewMoreImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Validate required fields
            if (!formData.name || !formData.ownerName || !formData.location || 
                !formData.distance || !formData.description || !formData.price || 
                !formData.serviceType || formData.petTypes.length === 0 || !formData.base64Image) {
                setError('Please fill in all required fields');
                return;
            }

            // Format the data according to the backend model
            const serviceData = {
                id: Date.now(), // Generate a unique ID
                name: formData.name,
                ownerName: formData.ownerName,
                location: formData.location,
                distance: formData.distance,
                description: formData.description,
                rating: 5,
                reviews: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
                completedBookings: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
                price: parseFloat(formData.price),
                serviceType: formData.serviceType,
                petTypes: formData.petTypes,
                badges: ['Certified', 'Top Rated'],
                base64Image: formData.base64Image,
                base64MoreImages: formData.base64MoreImages
            };

            const response = await axios.post('http://localhost:8080/api/pet-services/upload', serviceData);

            if (response.status === 201) {
                navigate('/my-listings');
            }
        } catch (err) {
            console.error('Error creating listing:', err);
            setError(err.response?.data?.message || 'Error creating listing. Please try again.');
        }
    };

    return (
        <div className="create-listing-container">
            <h2>Create New Pet Service Listing</h2>
            <form onSubmit={handleSubmit} className="create-listing-form">
                <div className="form-group">
                    <label>Service Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter service name"
                    />
                </div>

                <div className="form-group">
                    <label>Owner Name</label>
                    <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        placeholder="Enter owner name"
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Enter location"
                    />
                </div>

                <div className="form-group">
                    <label>Distance</label>
                    <input
                        type="text"
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 2.5 km"
                    />
                </div>

                <div className="form-group">
                    <label>Service Type</label>
                    <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select service type</option>
                        {serviceTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Pet Types</label>
                    <div className="pet-types-grid">
                        {petTypes.map(type => (
                            <label key={type} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={type}
                                    checked={formData.petTypes.includes(type)}
                                    onChange={handlePetTypeChange}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Describe your service"
                    />
                </div>

                <div className="form-group">
                    <label>Main Service Image</label>
                    <div className="image-upload-container">
                        {previewImage ? (
                            <div className="image-preview">
                                <img src={previewImage} alt="Preview" />
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={removeMainImage}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ) : (
                            <label className="image-upload-label">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                    required
                                    style={{ display: 'none' }}
                                />
                                <FaUpload className="upload-icon" />
                                <span>Upload Main Image</span>
                            </label>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Additional Images</label>
                    <div className="more-images-container">
                        <div className="more-images-grid">
                            {previewMoreImages.map((preview, index) => (
                                <div key={index} className="more-image-preview">
                                    <img src={preview} alt={`Additional ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => removeMoreImage(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label className="image-upload-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMoreImagesChange}
                                multiple
                                style={{ display: 'none' }}
                            />
                            <FaUpload className="upload-icon" />
                            <span>Add More Images</span>
                        </label>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-button">
                    Create Listing
                </button>
            </form>
        </div>
    );
};

export default CreateListing; 