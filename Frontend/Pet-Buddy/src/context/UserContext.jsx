import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async (email) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:8080/api/user/by-email/${email}`, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                setUserData(response.data);
            }
            return response.data;
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateUserData = (newData) => {
        setUserData(prevData => ({
            ...prevData,
            ...newData
        }));
    };

    const value = {
        userData,
        loading,
        error,
        fetchUserData,
        updateUserData
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext; 