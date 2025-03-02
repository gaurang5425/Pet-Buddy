import React, { createContext, useContext, useState, useEffect } from 'react';
import logo from '../assets/pro1.jpg';
// Hardcoded user data
const HARDCODED_USERS = {
    google: {
        id: 'google_123',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        profileImage: logo,
        provider: 'google'
    },
    email: {
        id: 'email_123',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        profileImage: null,
        provider: 'email'
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check for stored user on initial load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const loginWithGoogle = () => {
        // Simulate Google login with hardcoded data
        const user = HARDCODED_USERS.google;
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    };

    const loginWithEmail = () => {
        // Simulate email login with hardcoded data
        const user = HARDCODED_USERS.email;
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            loginWithGoogle,
            loginWithEmail,
            logout,
            isAuthenticated: !!currentUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 