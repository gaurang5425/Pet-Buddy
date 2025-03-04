import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceRequests.css"; // Add CSS for styling

const ServiceRequests = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching service requests...");

            const response = await axios.get("http://localhost:8080/api/services/requests", {
                withCredentials: true, // Enables session authentication
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            console.log("API Response:", response.data);

            if (response.data && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                console.warn("Unexpected API response format:", response.data);
                setError("Invalid data received from the server.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.response?.data?.message || "Failed to load service requests.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="service-container"><div className="loading">Loading service requests...</div></div>;
    }

    if (error) {
        return (
            <div className="service-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="service-container">
            <h2 className="service-header">Service Requests</h2>
            {data.length > 0 ? (
                <ul className="service-list">
                    {data.map((request, index) => (
                        <li key={index} className="service-item">
                            <strong>{request.serviceName || "Unnamed Service"}</strong>
                            <p>Requested by: {request.requesterName || "Unknown"}</p>
                            <p>Status: {request.status || "Pending"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-requests">No service requests found.</p>
            )}
        </div>
    );
};

export default ServiceRequests;
