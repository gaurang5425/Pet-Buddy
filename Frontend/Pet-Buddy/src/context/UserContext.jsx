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
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('userData');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingTotal, setPendingTotal] = useState(() => {
        const saved = localStorage.getItem('pendingTotal');
        return saved ? parseFloat(saved) : 0;
    });
    const [completedTotal, setCompletedTotal] = useState(() => {
        const saved = localStorage.getItem('completedTotal');
        return saved ? parseFloat(saved) : 0;
    });
    const [bookingRequests, setBookingRequests] = useState(() => {
        const saved = localStorage.getItem('bookingRequests');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            localStorage.removeItem('userData');
            localStorage.removeItem('pendingTotal');
            localStorage.removeItem('completedTotal');
            localStorage.removeItem('bookingRequests');
            setPendingTotal(0);
            setCompletedTotal(0);
            setBookingRequests([]);
            setError(null);
        }
    }, [userData]);


    useEffect(() => {
        localStorage.setItem('pendingTotal', pendingTotal.toString());
    }, [pendingTotal]);

    useEffect(() => {
        localStorage.setItem('completedTotal', completedTotal.toString());
    }, [completedTotal]);

    useEffect(() => {
        localStorage.setItem('bookingRequests', JSON.stringify(bookingRequests));
    }, [bookingRequests]);

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
        if (newData === null) {
            // Clear all data when logging out
            setUserData(null);
            setPendingTotal(0);
            setCompletedTotal(0);
            setBookingRequests([]);
            setError(null);
            localStorage.clear();
        } else {
            setUserData(prevData => ({
                ...prevData,
                ...newData
            }));
        }
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