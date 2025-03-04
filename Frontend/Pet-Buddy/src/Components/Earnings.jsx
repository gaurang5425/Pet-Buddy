import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { FaCalendar, FaWallet, FaClock } from 'react-icons/fa';
import './Earnings.css';

const Earnings = () => {
    const { userData } = useUser();
    const [timeframe, setTimeframe] = useState('week');

    return (
        <div className="earnings-container">
            <h1>My Earnings</h1>

            <div className="earnings-overview">
                <div className="earnings-card">
                    <FaWallet className="card-icon" />
                    <div className="card-content">
                        <h3>Total Earnings</h3>
                        <p className="amount">₹0.00</p>
                    </div>
                </div>
                <div className="earnings-card">
                    <FaClock className="card-icon" />
                    <div className="card-content">
                        <h3>Pending Payments</h3>
                        <p className="amount">₹0.00</p>
                    </div>
                </div>
                <div className="earnings-card">
                    <FaCalendar className="card-icon" />
                    <div className="card-content">
                        <h3>This Month</h3>
                        <p className="amount">₹0.00</p>
                    </div>
                </div>
            </div>

            <div className="earnings-details">
                <div className="timeframe-selector">
                    <button 
                        className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeframe('week')}
                    >
                        This Week
                    </button>
                    <button 
                        className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeframe('month')}
                    >
                        This Month
                    </button>
                    <button 
                        className={`timeframe-btn ${timeframe === 'year' ? 'active' : ''}`}
                        onClick={() => setTimeframe('year')}
                    >
                        This Year
                    </button>
                </div>

                <div className="transactions-list">
                    <div className="no-transactions-message">
                        <p>No transactions found for this period.</p>
                        <p>Completed bookings and their payments will appear here!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Earnings; 