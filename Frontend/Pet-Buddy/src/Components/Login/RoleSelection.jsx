import React from 'react';
import { FaUser, FaHome } from 'react-icons/fa';
import axios from 'axios';
import './RoleSelection.css';

const RoleSelection = ({ onRoleSelect, email }) => {
    const handleRoleSelect = async (role) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/user/update-role/${email}/${role}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                onRoleSelect(role);
            } else {
                console.error('Failed to update role:', response.data);
                alert('Failed to update role. Please try again.');
            }
        } catch (error) {
            console.error('Error updating role:', error.response?.data || error.message);
            alert('Error updating role. Please try again later.');
        }
    };

    return (
        <div className="role-selection-overlay">
            <div className="role-selection-card">
                <h2>Welcome to Pet-Buddy!</h2>
                <p>Please select your role to continue</p>
                
                <div className="role-options">
                    <button 
                        className="role-button"
                        onClick={() => handleRoleSelect('USER')}
                    >
                        <FaUser className="role-icon" />
                        <h3>Pet Owner</h3>
                        <p>I want to find pet services</p>
                    </button>

                    <button 
                        className="role-button"
                        onClick={() => handleRoleSelect('OWNER')}
                    >
                        <FaHome className="role-icon" />
                        <h3>Service Provider</h3>
                        <p>I want to offer pet services</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection; 