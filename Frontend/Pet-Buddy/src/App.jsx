import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import Navbar from "./Components/Navbar";
import ProfileNavbar from "./Components/ProfileNavbar";
import Home from "./Components/Home";
import PetSitters from "./Components/PetSitters";
import HelpCenter from "./Components/HelpCenter";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import LoginNavbar from "./Components/LoginNavbar";
import Signup_Login_Footer from "./Components/Signup_Login_Footer";
import UserProfile from "./Components/UserProfile";
import PetSitterProfile from './Components/PetSitterProfile';
import ContactForm from './Components/ContactForm';
import MyRequests from './Components/MyRequests';
import RequestSummary from './Components/RequestSummary';
// import MyBookings from './Components/MyBookings';
import MyListings from './Components/MyListings';
import BookingRequests from './Components/BookingRequests';
import Earnings from './Components/Earnings';
import ServiceRequests from './Components/ServiceRequests';
import PaymentFailure from './Components/PaymentFailure';
import PaymentSuccess from './Components/PaymentSuccess';
import CreateListing from './Components/CreateListing';
// import Signup from "./Components/Signup";
// import Signup from "./Components/Signup";
import "./App.css";

const Layout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/Login";
    const isSignupPage = location.pathname === "/Signup";
    const isProfilePage = location.pathname === "/UserProfile" || location.pathname === "/my-requests";
    const isNewTab = window.opener !== null;


    return (
        <div className="App">
               {isProfilePage ? (
                <ProfileNavbar />
            ) : (isLoginPage || isSignupPage) ? (
                <LoginNavbar />
            ) : (
                <Navbar />
            )}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/PetSitters" element={<PetSitters />} />
                <Route path="/HelpCenter" element={<HelpCenter />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Signup_Login_Footer" element={<Signup_Login_Footer />} />
                <Route path="/UserProfile" element={<UserProfile />} />
                <Route path="/pet-sitter/:id" element={<PetSitterProfile />} />
                <Route path="/ContactForm" element={<ContactForm />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/RequestSummary" element={<RequestSummary />} />
                {/* <Route path="/Signup" element={<Signup />} /> */}
                {/* <Route path="/my-bookings" element={<MyBookings />} /> */}
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/booking-requests" element={<BookingRequests />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/service-requests" element={<ServiceRequests />} />
                <Route path="/create-listing" element={<CreateListing />} />
            </Routes>
            {(isLoginPage || isSignupPage) && isNewTab ?  <Signup_Login_Footer/> : null}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <Router>
                    <Layout />
                </Router>
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
