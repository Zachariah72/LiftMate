// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import AirportSelection from './pages/AirportSelection';
import CitySelection from './pages/CitySelection';
import RideRequest from './pages/RideRequest';
import RideHistory from './pages/RideHistory';
import DriverDashboard from './pages/DriverDashboard';
import RideRequestsList from './pages/RideRequestsList';
import CurrentRidePage from './pages/CurrentRidePage';
import Home from './pages/Home';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { NotificationContainer, useNotifications } from './components/ui/Notification';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [driverStatus, setDriverStatus] = useState({ currentRide: null, todaysEarnings: 0 });
  const { notifications, closeNotification, success, error, warning, info } = useNotifications();

  // Update driver status when on driver dashboard
  useEffect(() => {
    if (location.pathname === '/driver-dashboard' && user?.role === 'driver') {
      // This would ideally come from a context or API call
      // For now, we'll set defaults
      setDriverStatus({ currentRide: null, todaysEarnings: 0 });
    }
  }, [location.pathname, user]);

  const isDriverDashboard = location.pathname === '/driver-dashboard' && user?.role === 'driver';

  return (
    <>
      <Navbar />
      <Box>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/airports" element={<AirportSelection />} />
          <Route path="/cities" element={<CitySelection />} />
          <Route
            path="/ride-request"
            element={
              <PrivateRoute>
                <RideRequest />
              </PrivateRoute>
            }
          />
          <Route
            path="/ride-history"
            element={
              <PrivateRoute>
                <RideHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/driver-dashboard"
            element={
              <PrivateRoute>
                <DriverDashboard onStatusUpdate={setDriverStatus} />
              </PrivateRoute>
            }
          />
          <Route
            path="/ride-requests-list"
            element={
              <PrivateRoute>
                <RideRequestsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/current-ride"
            element={
              <PrivateRoute>
                <CurrentRidePage />
              </PrivateRoute>
            }
          />
          {/* Catch-all redirects to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
      <Footer />

      {/* Global Notifications */}
      <NotificationContainer
        notifications={notifications}
        onClose={closeNotification}
      />
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
