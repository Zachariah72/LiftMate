// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Raleway',
      'sans-serif',
    ].join(','),
  },
});

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
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
                    <DriverDashboard />
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
              <Route
                path="/driver-dashboard"
                element={
                  <PrivateRoute>
                    <DriverDashboard />
                  </PrivateRoute>
                }
              />
              {/* Catch-all redirects to Home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
