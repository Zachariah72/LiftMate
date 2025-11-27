import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  keyframes
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Navigation as NavigationIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const LiveTripTracker = ({ ride, onLocationUpdate }) => {
  const { user } = useContext(AuthContext);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tripProgress, setTripProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('15 mins');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (ride && user?.role === 'driver') {
      startLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [ride, user]);

  const startLocationTracking = () => {
    setIsTracking(true);

    // Simulate location updates every 10 seconds
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = { lat: latitude, lng: longitude };

            setCurrentLocation(location);

            // Update progress based on distance to destination
            updateTripProgress(location);

            // Call parent callback if provided
            if (onLocationUpdate) {
              onLocationUpdate(location);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        );
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  };

  const stopLocationTracking = () => {
    setIsTracking(false);
  };

  const updateTripProgress = (currentLoc) => {
    // Simple progress calculation based on time elapsed
    // In a real app, this would calculate based on actual route progress
    const progress = Math.min(tripProgress + Math.random() * 10, 90);
    setTripProgress(progress);

    // Update estimated time
    const remainingTime = Math.max(1, Math.round((100 - progress) / 10));
    setEstimatedTime(`${remainingTime} min${remainingTime > 1 ? 's' : ''}`);
  };

  if (!ride) return null;

  const isDriver = user?.role === 'driver';
  const passenger = ride.passenger;
  const driver = ride.driver;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        border: '2px solid #667eea',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <NavigationIcon sx={{ color: '#667eea', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          🚗 Live Trip Tracking
        </Typography>
        {isTracking && (
          <Chip
            label="LIVE"
            size="small"
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              animation: `${pulse} 2s infinite`,
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>

      {/* Trip Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Trip Progress
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
            {Math.round(tripProgress)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={tripProgress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#667eea',
              borderRadius: 4
            }
          }}
        />
      </Box>

      {/* Location Info */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
            📍 From
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {ride.pickupLocation}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
            🎯 To
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {ride.dropoffLocation}
          </Typography>
        </Box>
      </Box>

      {/* Estimated Time */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TimeIcon sx={{ color: '#ff9800' }} />
        <Typography variant="body1">
          Estimated arrival: <strong>{estimatedTime}</strong>
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Contact Information */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
          📞 Contact Information
        </Typography>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Passenger Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
              👤 Passenger
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                {passenger?.name?.charAt(0)?.toUpperCase() || 'P'}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {passenger?.name || 'Passenger'}
                </Typography>
                {passenger?.phoneNumber && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 14, color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {passenger.phoneNumber}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Driver Info */}
          {isDriver && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                🚗 Driver
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#4caf50' }}>
                  {driver?.name?.charAt(0)?.toUpperCase() || 'D'}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {driver?.name || 'Driver'}
                  </Typography>
                  {driver?.phoneNumber && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: '#666' }} />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {driver.phoneNumber}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Current Location Display */}
      {currentLocation && isTracking && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9ff', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
            📍 Current Location
          </Typography>
          <Typography variant="caption" sx={{ color: '#888' }}>
            Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LiveTripTracker;