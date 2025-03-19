import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import Navbar from "./Components/Navbar/Navbar.jsx";
import ProfileNavbar from "./Components/Profile/ProfileNavbar.jsx";
import Home from "./Components/Home&Help/Home.jsx";
import PetSitters from "./Components/PetOwner/PetSitters.jsx";
import HelpCenter from "./Components/Home&Help/HelpCenter.jsx";
import Login from "./Components/Login/Login.jsx";
import LoginNavbar from "./Components/Login/LoginNavbar.jsx";
import Signup_Login_Footer from "./Components/Login/Signup_Login_Footer.jsx";
import UserProfile from "./Components/Profile/UserProfile.jsx";
import PetSitterProfile from './Components/PetOwner/PetSitterProfile.jsx';
import ContactForm from './Components/PetOwner/ContactForm.jsx';
import MyRequests from './Components/PetOwner/MyRequests.jsx';
import RequestSummary from './Components/PetOwner/RequestSummary.jsx';
import MyListings from './Components/ServiceProvider/MyListings.jsx';
import BookingRequests from './Components/ServiceProvider/BookingRequests.jsx';
import PaymentFailure from './Components/PetOwner/PaymentFailure.jsx';
import PaymentSuccess from './Components/PetOwner/PaymentSuccess.jsx';
import CreateListing from './Components/ServiceProvider/CreateListing.jsx';
// import Signup from "./Components/Signup";
// import Signup from "./Components/Signup";
import "./App.css";
import Footer from "./Components/Footer/Footer.jsx";
import TermsAndConditions from "./Components/Footer/TermsAndConditions.jsx";
import UserContactForm from "./Components/Footer/UserContactForm.jsx";
import PrivacyPolicy from "./Components/Footer/PrivacyPolicy.jsx";
import AboutUs from "./Components/Footer/AboutUs.jsx";
import AdminPanel from './Components/Admin/AdminPanel.jsx';
import AdminNavbar from "./Components/Admin/AdminNavbar.jsx";

const Layout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/Login";
    const isSignupPage = location.pathname === "/Signup";
    const isProfilePage = location.pathname === "/UserProfile" || location.pathname === "/my-requests";
    const isNewTab = window.opener !== null;
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <div className="App">
            {isAdminPage ? (
                <AdminNavbar />
            ) : isProfilePage ? (
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
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/booking-requests" element={<BookingRequests />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path={"/TermsAndConditions"} element={<TermsAndConditions />} />
                <Route path={"/UserContactForm"} element={<UserContactForm />} />
                <Route path={"/PrivacyPolicy"} element={<PrivacyPolicy />} />
                <Route path={"/AboutUs"} element={<AboutUs />} />
                <Route path="/admin" element={<AdminPanel />} />
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
                    <Footer />
                </Router>
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
