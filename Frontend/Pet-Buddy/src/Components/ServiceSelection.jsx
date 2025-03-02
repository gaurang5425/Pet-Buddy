import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceSelection.css';

// Import images
import petBoarding from '../assets/service/pet-boarding.png';
import petDayCare from '../assets/service/pet-day-care.png';
import petSitting from '../assets/service/pet-house-sitting.png';
import dogWalking from '../assets/service/dog-walking.png';
import petTaxi from '../assets/service/pet-taxi.png';
import petGrooming from '../assets/service/pet-grooming.png';
import petTraining from '../assets/service/pet-training.png';

const ServiceSelection = () => {
    const navigate = useNavigate();

    const services = [
        {
            id: 1,
            title: 'Pet Boarding',
            description: 'Perfect if your pet needs overnight pet care.',
            image: petBoarding
        },
        {
            id: 2,
            title: 'Pet Day Care',
            description: 'Daytime pet care in your pet sitter\'s pet-friendly home.',
            image: petDayCare
        },
        {
            id: 3,
            title: 'Pet Sitting',
            description: 'For pets that need drop ins at their home or house-sitting services overnight.',
            image: petSitting
        },
        {
            id: 4,
            title: 'Dog Walking',
            description: 'For dogs that needs a walk or two.',
            image: dogWalking
        },
        {
            id: 5,
            title: 'Pet Taxi',
            description: 'Transportation service for your pets.',
            image: petTaxi
        },
        {
            id: 6,
            title: 'Pet Grooming',
            description: 'Professional grooming services for your pets.',
            image: petGrooming
        },
        {
            id: 7,
            title: 'Pet Training',
            description: 'Professional training for better pet behavior.',
            image: petTraining
        }
    ];

    const handleServiceClick = (service) => {
        navigate('/ContactForm', { state: { selectedService: service } });
    };

    return (
        <div className="service-selection-container">
            <h1>GET SERVICES</h1>
            <div className="services-grid">
                {services.map((service) => (
                    <div 
                        key={service.id} 
                        className="service-card"
                        onClick={() => handleServiceClick(service)}
                    >
                        <div className="service-image">
                            <img src={service.image} alt={service.title} />
                        </div>
                        <h2>{service.title}</h2>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceSelection; 