import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Pricing from './pages/Pricing';
import ProfileView from './pages/ProfileView';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import ActivateAccount from './pages/ActivateAccount';
import { AuthProvider } from './context/AuthContext';
import CompleteVerification from './pages/CompleteVerification';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/activate-account" element={<ActivateAccount />} />
                <Route path="/complete-verification" element={<CompleteVerification />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile/:id" element={<ProfileView />} />
                {/* Add more routes as we create more pages */}
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
