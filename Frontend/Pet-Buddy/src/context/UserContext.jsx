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
    const [pendingTotal, setPendingTotal] = useState(0);
    const [completedTotal, setCompletedTotal] = useState(0);
    const [bookingRequests, setBookingRequests] = useState([]);

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

    const fetchBookingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/services/requests');
            setBookingRequests(response.data);

            // Calculate totals
            const pending = response.data
                .filter(req => req.status === 'pending')
                .reduce((sum, req) => sum + req.price, 0);

            const completed = response.data
                .filter(req => req.status === 'DONE')
                .reduce((sum, req) => sum + req.price, 0);

            setPendingTotal(pending);
            setCompletedTotal(completed);

            console.log('Pending Total:', pending);
            console.log('Completed Total:', completed);
        } catch (err) {
            console.error('Error fetching booking requests:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchBookingRequests();
        }
    }, [userData]);

    const value = {
        userData,
        loading,
        error,
        fetchUserData,
        updateUserData,
        pendingTotal,
        completedTotal,
        bookingRequests,
        fetchBookingRequests
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;