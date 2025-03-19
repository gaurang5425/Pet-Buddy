import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext.jsx';
import axios from 'axios';
import { FaUpload, FaTimes, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import './CreateListing.css';

const CreateListing = () => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [formData, setFormData] = useState({
        name: '',
        ownerName: userData?.name || '',
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
    const [validation, setValidation] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);

    const serviceTypes = [
        'Pet Boarding',
        'House Sitting',
        'Dog Walking',
        'Pet Daycare',
        'Pet Grooming',
        'Pet Taxi'
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

    // Calculate form completion progress
    useEffect(() => {
        const requiredFields = [
            'name',
            'ownerName',
            'location',
            'distance',
            'description',
            'price',
            'serviceType'
        ];
        
        const completedFields = requiredFields.filter(field => formData[field] !== '');
        const petTypesSelected = formData.petTypes.length > 0;
        const imageUploaded = formData.base64Image !== '';
        
        const totalFields = requiredFields.length + 2; // +2 for petTypes and image
        const completedCount = completedFields.length + (petTypesSelected ? 1 : 0) + (imageUploaded ? 1 : 0);
        
        setProgress(Math.round((completedCount / totalFields) * 100));
    }, [formData]);

    useEffect(() => {
        // Update ownerName when userData changes
        if (userData?.name) {
            setFormData(prev => ({
                ...prev,
                ownerName: userData.name
            }));
        }
    }, [userData]);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return value.length >= 3 ? 'valid' : 'Name must be at least 3 characters long';
            case 'ownerName':
                return value.length >= 2 ? 'valid' : 'Owner name must be at least 2 characters long';
            case 'location':
                return value.length >= 5 ? 'valid' : 'Please enter a valid location';
            case 'distance':
                return /^\d+(\.\d+)?\s*(km|miles)$/i.test(value) ? 'valid' : 'Format: 2.5 km or 1.5 miles';
            case 'price':
                return value > 0 ? 'valid' : 'Price must be greater than 0';
            case 'description':
                return value.length >= 50 ? 'valid' : 'Description must be at least 50 characters long';
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

    const handlePetTypeChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            petTypes: checked 
                ? [...prev.petTypes, value]
                : prev.petTypes.filter(type => type !== value)
        }));
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Validate total number of images (max 6: 1 main + 5 additional)
            if (files.length > 6) {
                setError('You can upload maximum 6 images (1 main + 5 additional)');
                return;
            }

            // Validate file sizes
            const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
            if (oversizedFiles.length > 0) {
                setError('All images should be less than 5MB');
                return;
            }

            // First image becomes main image, rest go to additional images
            const [mainFile, ...additionalFiles] = files;

            // Handle main image
            const mainReader = new FileReader();
            mainReader.onloadend = () => {
                setPreviewImage(mainReader.result);
                setFormData(prev => ({
                    ...prev,
                    image: mainFile,
                    base64Image: mainReader.result.split(',')[1]
                }));
            };
            mainReader.readAsDataURL(mainFile);

            // Handle additional images
            const newPreviews = [];
            const newBase64Images = [];

            additionalFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    newBase64Images.push(reader.result.split(',')[1]);

                    if (newPreviews.length === additionalFiles.length) {
                        setPreviewMoreImages(newPreviews);
                        setFormData(prev => ({
                            ...prev,
                            moreImages: additionalFiles,
                            base64MoreImages: newBase64Images
                        }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeMainImage = () => {
        if (previewMoreImages.length > 0) {
            // Move first additional image to main image
            const [newMain, ...restImages] = previewMoreImages;
            const [newMainFile, ...restFiles] = formData.moreImages;
            const [newMainBase64, ...restBase64] = formData.base64MoreImages;

            setPreviewImage(newMain);
            setPreviewMoreImages(restImages);
            setFormData(prev => ({
                ...prev,
                image: newMainFile,
                base64Image: newMainBase64,
                moreImages: restFiles,
                base64MoreImages: restBase64
            }));
        } else {
            setPreviewImage(null);
            setFormData(prev => ({
                ...prev,
                image: null,
                base64Image: ''
            }));
        }
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
        setIsSubmitting(true);

        try {
            // Check required fields first
            if (!formData.name || !formData.ownerName || !formData.location || 
                !formData.distance || !formData.description || !formData.price || 
                !formData.serviceType || formData.petTypes.length === 0 || !formData.base64Image) {
                setError('Please fill in all required fields');
                setIsSubmitting(false);
                return;
            }

            // Validate each field
            const newValidation = {};
            let hasErrors = false;

            // Only validate fields that have values
            Object.keys(formData).forEach(key => {
                if (key !== 'rating' && key !== 'reviews' && key !== 'completedBookings' && 
                    key !== 'badges' && key !== 'image' && key !== 'moreImages' && 
                    key !== 'base64Image' && key !== 'base64MoreImages') {
                    const value = formData[key];
                    if (value) {  // Only validate if the field has a value
                        const validationResult = validateField(key, value);
                        newValidation[key] = validationResult;
                        if (validationResult !== 'valid') {
                            hasErrors = true;
                        }
                    }
                }
            });

            setValidation(newValidation);

            if (hasErrors) {
                setError('Please fix the validation errors before submitting');
                setIsSubmitting(false);
                return;
            }

            const serviceData = {
                id: Date.now(),
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="create-listing-container">
                <h2>Create New Pet Service Listing</h2>
                
                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                </div>

                <form onSubmit={handleSubmit} className="create-listing-form">
                    <div className="form-group">
                        <label>Service Name</label>
                        <div className="input-container">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter service name"
                                className={validation.name === 'valid' ? 'valid' : validation.name ? 'invalid' : ''}
                            />
                            {validation.name === 'valid' && <FaCheck className="validation-icon valid" />}
                            {validation.name && validation.name !== 'valid' && (
                                <FaExclamationCircle className="validation-icon invalid" />
                            )}
                        </div>
                        {validation.name && validation.name !== 'valid' && (
                            <span className="validation-message">{validation.name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Owner Name</label>
                        <div className="input-container">
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                readOnly
                                className="valid"
                                style={{ backgroundColor: '#f5f5f5' }}
                            />
                            <FaCheck className="validation-icon valid" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <div className="input-container">
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="Enter location"
                                className={validation.location === 'valid' ? 'valid' : validation.location ? 'invalid' : ''}
                            />
                            {validation.location === 'valid' && <FaCheck className="validation-icon valid" />}
                            {validation.location && validation.location !== 'valid' && (
                                <FaExclamationCircle className="validation-icon invalid" />
                            )}
                        </div>
                        {validation.location && validation.location !== 'valid' && (
                            <span className="validation-message">{validation.location}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Distance</label>
                        <div className="input-container">
                            <input
                                type="text"
                                name="distance"
                                value={formData.distance}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 2.5 km"
                                className={validation.distance === 'valid' ? 'valid' : validation.distance ? 'invalid' : ''}
                            />
                            {validation.distance === 'valid' && <FaCheck className="validation-icon valid" />}
                            {validation.distance && validation.distance !== 'valid' && (
                                <FaExclamationCircle className="validation-icon invalid" />
                            )}
                        </div>
                        {validation.distance && validation.distance !== 'valid' && (
                            <span className="validation-message">{validation.distance}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Service Type</label>
                        <div className="input-container">
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                                className={validation.serviceType === 'valid' ? 'valid' : validation.serviceType ? 'invalid' : ''}
                            >
                                <option value="">Select service type</option>
                                {serviceTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {validation.serviceType === 'valid' && <FaCheck className="validation-icon valid" />}
                            {validation.serviceType && validation.serviceType !== 'valid' && (
                                <FaExclamationCircle className="validation-icon invalid" />
                            )}
                        </div>
                        {validation.serviceType && validation.serviceType !== 'valid' && (
                            <span className="validation-message">{validation.serviceType}</span>
                        )}
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
                        <div className="input-container">
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                                className={validation.price === 'valid' ? 'valid' : validation.price ? 'invalid' : ''}
                            />
                            {validation.price === 'valid' && <FaCheck className="validation-icon valid" />}
                            {validation.price && validation.price !== 'valid' && (
                                <FaExclamationCircle className="validation-icon invalid" />
                            )}
                        </div>
                        {validation.price && validation.price !== 'valid' && (
                            <span className="validation-message">{validation.price}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <div className="input-container">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="Describe your service"
                                className={validation.description === 'valid' ? 'valid' : validation.description ? 'invalid' : ''}
                            />
                            {validation.description === 'valid' && <FaCheck className="validation-icon valid" />}
                            {validation.description && validation.description !== 'valid' && (
                                <FaExclamationCircle className="validation-icon invalid" />
                            )}
                        </div>
                        {validation.description && validation.description !== 'valid' && (
                            <span className="validation-message">{validation.description}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Service Images</label>
                        <div className="image-upload-container">
                            <div className="images-grid">
                                {previewImage && (
                                    <div className="main-image-preview">
                                        <img src={previewImage} alt="Main Preview" />
                                        <span className="main-image-label">Main Image</span>
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={removeMainImage}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                                {previewMoreImages.map((preview, index) => (
                                    <div key={index} className="image-preview">
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
                                <label className="image-upload-label">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImagesChange}
                                        multiple
                                        required={!previewImage}
                                        style={{ display: 'none' }}
                                    />
                                    <FaUpload className="upload-icon" />
                                    <span> Upload Images</span>
                                    <small> First image will be the main image</small>
                                </label>
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListing; 