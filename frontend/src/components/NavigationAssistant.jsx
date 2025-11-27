import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, keyframes } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import NavigationIcon from '@mui/icons-material/Navigation';
import MapView from './MapView';

// Mock navigation data - in real app, this would come from GPS/maps API
const mockNavigationData = {
  distance: 2450, // meters
  time: 8, // minutes
  nextTurn: {
    direction: 'right',
    distance: 320, // meters to turn
    instruction: 'Turn right onto Main Street'
  },
  currentSpeed: 45, // km/h
  speedLimit: 50 // km/h
};

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const NavigationAssistant = ({ currentRide, onCompleteRide, onArrive }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [navigationData, setNavigationData] = useState(mockNavigationData);

  // Simulate navigation updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNavigationData(prev => ({
        ...prev,
        distance: Math.max(0, prev.distance - Math.random() * 50),
        nextTurn: {
          ...prev.nextTurn,
          distance: Math.max(0, prev.nextTurn.distance - Math.random() * 30)
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getTurnIcon = (direction) => {
    const rotation = direction === 'right' ? '45deg' :
                    direction === 'left' ? '-45deg' :
                    direction === 'straight' ? '0deg' : '90deg';
    return (
      <NavigationIcon
        sx={{
          fontSize: 48,
          color: '#fff',
          transform: `rotate(${rotation})`,
          animation: navigationData.nextTurn.distance < 100 ? `${pulse} 1s infinite` : 'none'
        }}
      />
    );
  };

  return (
    <>
      {/* Full Screen Map Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          backgroundColor: '#000'
        }}
      >
        <MapView
          center={[-1.2921, 36.8219]}
          markers={[]}
          pickup={currentRide ? [parseFloat(currentRide.pickupLocation.split(',')[0]), parseFloat(currentRide.pickupLocation.split(',')[1])] : null}
          dropoff={currentRide ? [parseFloat(currentRide.dropoffLocation.split(',')[0]), parseFloat(currentRide.dropoffLocation.split(',')[1])] : null}
          routes={[]} // Add routes if needed
          fullScreen={true}
        />
        {/* Navigation Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, rgba(35, 76, 106, 0.9) 0%, rgba(102, 126, 234, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            padding: '16px 20px',
            zIndex: 1001,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              🚗 Navigation Mode
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {currentRide?.passenger?.name} • {formatDistance(navigationData.distance)} remaining
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setIsMuted(!isMuted)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Turn-by-Turn Navigation */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 200,
            left: 20,
            right: 20,
            zIndex: 1001
          }}
        >
          <Paper
            elevation={8}
            sx={{
              background: 'linear-gradient(135deg, #234C6A 0%, #667eea 100%)',
              borderRadius: 3,
              padding: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            {/* Turn Arrow */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: navigationData.nextTurn.distance < 100 ? '#ff4444' : '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {getTurnIcon(navigationData.nextTurn.direction)}
            </Box>

            {/* Navigation Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.8rem',
                  mb: 1
                }}
              >
                {formatDistance(navigationData.nextTurn.distance)}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1.1rem',
                  lineHeight: 1.3
                }}
              >
                {navigationData.nextTurn.instruction}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mt: 1
                }}
              >
                Continue for {formatDistance(navigationData.distance)} • {navigationData.time} min
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            zIndex: 1001,
            display: 'flex',
            gap: 2
          }}
        >
          <Paper
            elevation={8}
            sx={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 3,
              padding: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }
            }}
            onClick={onArrive}
          >
            <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
              📍 Arrived at Pickup
            </Typography>
          </Paper>

          <Paper
            elevation={8}
            sx={{
              flex: 1,
              backgroundColor: 'rgba(76, 175, 80, 0.95)',
              borderRadius: 3,
              padding: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#4caf50',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
              }
            }}
            onClick={onCompleteRide}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              ✅ Complete Trip
            </Typography>
          </Paper>
        </Box>

        {/* Speed and Distance Display */}
        <Box
          sx={{
            position: 'absolute',
            top: 100,
            right: 20,
            zIndex: 1001
          }}
        >
          <Paper
            elevation={6}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: 2,
              padding: 2,
              minWidth: 120,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              {navigationData.currentSpeed}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              km/h
            </Typography>
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold', mt: 1 }}>
              Limit: {navigationData.speedLimit}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default NavigationAssistant;