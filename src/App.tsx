import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
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
import CompleteVerification from "./pages/CompleteVerification";
import BuyContacts from "./pages/BuyContacts";
import ShippingAndDelivery from "./pages/ShippingAndDelivery";
import CancellationAndRefund from "./pages/CancellationAndRefund";
import ScrollToTop from "./components/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAppSelector from "./hooks/useAppSelector";
import { useGetNotifications } from "./queries/notification";
import { addNotification } from "./store/slices/notificationsSlice";
import useAppDispatch from "./hooks/useAppDispatch";
import baseUrl from "./api/baseUrl";
import { io } from "socket.io-client";

const queryClient = new QueryClient();

const RouterComponent = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { data: notificationsData } = useGetNotifications();

  useEffect(() => {
    const socket = io(baseUrl);

    if (auth.token && auth.role === "job_seeker") {
      socket.on("notification", (data) => {
        if (data.to === auth.userId) {
          const company = data?.company ?? "";
          const message = `A recruiter from ${company ?? "a company"} has ${
            data.type === "profile_view"
              ? "viewed your profile"
              : "unlocked your contact information"
          }`;

          dispatch(
            addNotification({
              id: data.id,
              message,
              type: data.type,
              to: data.to,
              seen: data.seen,
              company: data.company,
              createdAt: data.createdAt,
            })
          );
        }
      });
    }

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    if (notificationsData) {
      notificationsData.forEach((notification) => {
        const company = notification.company;
        const message = `A recruiter from ${company ?? "a company"} has ${
          notification.type === "profile_view"
            ? "viewed your profile"
            : "unlocked your contact information"
        }`;
        dispatch(addNotification({ ...notification, message }));
      });
    }
  }, [notificationsData]);

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping" element={<ShippingAndDelivery />} />
            <Route path="/refund" element={<CancellationAndRefund />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterComponent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
