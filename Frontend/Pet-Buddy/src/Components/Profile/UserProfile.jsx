import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import axios from "axios";
import { useAuth } from '../../context/AuthContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { FaSignOutAlt, FaPlusCircle, FaTrash, FaMoneyCheckAlt, FaUserCircle, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RoleSelection from '../Login/RoleSelection.jsx';
import defaultProfileImg from '../../assets/default.jpeg';

// Configure axios defaults
axios.defaults.withCredentials = true;

const UserProfile = () => {
    const { currentUser, logout } = useAuth();
    const { userData, loading: userLoading, error: userError, fetchUserData, updateUserData } = useUser();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRoleSelection, setShowRoleSelection] = useState(false);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            // First get basic user info
            const response = await axios.get('http://localhost:8080/api/user/user-info', {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('User Info:', response.data);
            if (response.data && response.data.email) {
                // Fetch detailed user info using context
                const detailedUserData = await fetchUserData(response.data.email);
                
                if (detailedUserData) {
                    // Handle profile image priority
                    if (detailedUserData.profileImage) {
                        const imageUrl = detailedUserData.profileImage.startsWith('data:') 
                            ? detailedUserData.profileImage 
                            : `data:image/jpeg;base64,${detailedUserData.profileImage}`;
                        setSelectedImage(imageUrl);
                    } else if (response.data.picture) {
                        setSelectedImage(response.data.picture);
                    } else {
                        setSelectedImage(defaultProfileImg);
                    }

                    // Check role
                    setShowRoleSelection(!detailedUserData.role);
                }
            } else {
                setSelectedImage(defaultProfileImg);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            setError('Failed to load user information. Please try logging in again.');
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const checkUserRole = async (email) => {
        try {
            if (!email) {
                console.error('No email provided for role check');
                return;
            }

            const emailResponse = await axios.get(`http://localhost:8080/api/user/by-email/${email}`, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (emailResponse.data) {
                // Update the userInfo state with the role information
                updateUserData({
                    role: emailResponse.data.role
                });
                setShowRoleSelection(!emailResponse.data.role);
            }
            
            console.log('Role check response:', emailResponse.data); // Debug log
        } catch (error) {
            console.error('Error checking user role:', error);
            // Don't set error state here as it's not critical
        }
    };

    const handleRoleSelect = async (role) => {
        setShowRoleSelection(false);
        await fetchUserInfo(); // Refresh all user info after role selection
    };

    const handleLogout = () => {
        // Clear user context
        updateUserData(null);
        // Clear auth context
        logout();
        // Redirect to backend logout endpoint
        window.location.href = 'http://localhost:8080/logout';
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const fullImageUrl = reader.result;
                // Remove the data URL prefix for sending to server
                const base64String = fullImageUrl.split(',')[1];
                setSelectedImage(fullImageUrl); // Keep the full URL for preview
                handleImageUpload(base64String);
            };
            reader.onerror = () => {
                console.error('Error reading file');
                alert('Error reading file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async (base64Image) => {
        try {
            setUploading(true);
            
            if (!userData?.email) {
                throw new Error('User email not found');
            }

            console.log('Uploading image...');
            const response = await axios.put(
                `http://localhost:8080/api/user/update-profile-image/${userData.email}`,
                {
                    profileImage: base64Image
                },
                {
                    withCredentials: true,
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );

            console.log('Server response:', response.data);

            if (response.data) {
                console.log("Profile photo updated successfully");
                const fullImageUrl = `data:image/jpeg;base64,${base64Image}`;
                setSelectedImage(fullImageUrl);
                // Update context with new image
                updateUserData({
                    profileImage: base64Image
                });
            } else {
                throw new Error('Failed to update profile photo');
            }
        } catch (error) {
            console.error("Error updating profile photo:", error);
            alert('Failed to update profile photo. Please try again.');
            setSelectedImage(defaultProfileImg);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-content">
                    <div className="loading">Loading user information...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <div className="profile-content">
                    <div className="error-message">
                        {error}
                        <button className="btn purple" onClick={() => navigate('/login')}>
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {showRoleSelection && (
                <RoleSelection 
                    onRoleSelect={handleRoleSelect} 
                    email={userData?.email}
                />
            )}
            <div className="profile-container">
                <div className="profile-content">
                    <div className="profile-header">
                        <div className="profile-pic-container">
                            <img 
                                src={
                                    selectedImage?.startsWith('data:') 
                                        ? selectedImage 
                                        : userData?.profileImage 
                                            ? `data:image/jpeg;base64,${userData.profileImage}`
                                            : defaultProfileImg
                                } 
                                alt="Profile" 
                                className="profile-pic"
                                onError={(e) => {
                                    console.log('Image load error:', e);
                                    e.target.onerror = null;
                                    e.target.src = defaultProfileImg;
                                }}
                            />
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

                        <h1 className="greeting">Hey, I'm <strong>{userData?.name || 'User'}</strong></h1>
                        <p className="email">{userData?.email || 'email@example.com'}</p>
                        {userData?.given_name && (
                            <p className="additional-info">
                                {userData.given_name} {userData.family_name}
                            </p>
                        )}
                        <div className="role-info">
                            <span className="role-label">Role:</span>
                            <span className="role-value">
                                {userData?.role ? (
                                    userData.role === 'OWNER' ? 'Service Provider 🏠' : 'Pet Owner 🐾'
                                ) : (
                                    'Not Selected ⚠️'
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn purple" onClick={handleLogout}>
                            <FaUserCircle /> Edit Profile
                        </button>
                        <button className="btn red" onClick={handleLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                        <button className="btn purple">
                            <FaPlusCircle />
                            {userData?.role ? (
                                userData.role === 'OWNER' ? (
                                    <span onClick={() => navigate('/create-listing')}>Create Listing</span>
                                ) : (
                                    <span onClick={() => navigate('/PetSitters')}>New Request</span>
                                )
                            ) : (
                                'Not Selected ⚠️'
                            )}
                        </button>
                        <button className="btn grey" disabled>
                            <FaTrash /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;