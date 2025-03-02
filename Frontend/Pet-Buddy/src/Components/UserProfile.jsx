import React, { useState } from "react";
import "./UserProfile.css";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaPlusCircle, FaTrash, FaMoneyCheckAlt, FaUserCircle, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(currentUser?.profileImage || null);
    const [uploading, setUploading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                handleImageUpload(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async (file) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            formData.append('username', currentUser?.name || 'user');

            const response = await axios.post("http://localhost:5000/api/upload-profile-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data?.success) {
                console.log("Profile photo updated successfully:", response.data);
                setSelectedImage(response.data.imageUrl); // Update image from API response
            } else {
                console.error("Failed to upload profile photo");
            }
        } catch (error) {
            console.error("Error uploading profile photo:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-pic-container">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Profile" className="profile-pic" />
                        ) : (
                            <FaUserCircle className="profile-pic-placeholder" />
                        )}
                        <label className="upload-photo-label" htmlFor="photo-upload">
                            <FaCamera className="camera-icon" />
                            <input
                                type="file"
                                id="photo-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                        {uploading && <div className="upload-overlay">Uploading...</div>}
                    </div>

                    <h1 className="greeting">Hey, I'm <strong>{currentUser?.name || 'User'}</strong></h1>
                    <p className="email">{currentUser?.email || 'email@example.com'}</p>
                </div>

                <div className="profile-actions">
                    <button className="btn purple">
                        <FaMoneyCheckAlt /> Payout Preferences
                    </button>
                    <button className="btn red" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                    <button className="btn purple">
                        <FaPlusCircle /> Create Listing
                    </button>
                    <button className="btn grey" disabled>
                        <FaTrash /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
