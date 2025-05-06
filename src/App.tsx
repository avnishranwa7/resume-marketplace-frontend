import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Pricing from "./pages/Pricing";
import ProfileView from "./pages/ProfileView";
import TermsAndConditions from "./pages/TermsAndConditions";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ActivateAccount from "./pages/ActivateAccount";
import { AuthProvider } from "./context/AuthContext";
import CompleteVerification from "./pages/CompleteVerification";
import BuyContacts from "./pages/BuyContacts";
import ShippingAndDelivery from './pages/ShippingAndDelivery';
import CancellationAndRefund from './pages/CancellationAndRefund';
import ScrollToTop from './components/ScrollToTop';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/activate-account" element={<ActivateAccount />} />
                <Route
                  path="/complete-verification"
                  element={<CompleteVerification />}
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/explore" element={<Explore />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile/:id" element={<ProfileView />} />
                <Route
                  path="/buy-contacts"
                  element={
                    <ProtectedRoute>
                      <BuyContacts />
                    </ProtectedRoute>
                  }
                />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/shipping" element={<ShippingAndDelivery />} />
                <Route path="/refund" element={<CancellationAndRefund />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
