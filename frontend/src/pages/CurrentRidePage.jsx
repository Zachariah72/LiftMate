import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { completeRide, markDriverArrived } from '../api/rides';
import MapView from '../components/MapView';
import LiveTripTracker from '../components/LiveTripTracker';
import { Container, Typography, Button, Box, Card, CardContent, Grid, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const CurrentRidePage = () => {
  const { user } = useContext(AuthContext);
  const [currentRide, setCurrentRide] = useState(null); // Assume passed via state or fetch
  const [remainingDistance, setRemainingDistance] = useState(5.2); // km
  const [remainingTime, setRemainingTime] = useState(12); // min
  const [currentStreet, setCurrentStreet] = useState('Koinange Street');
  const [nextStreet, setNextStreet] = useState('Luthuli Avenue');
  const [isMuted, setIsMuted] = useState(false);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingDistance(prev => Math.max(0, prev - 0.1));
      setRemainingTime(prev => Math.max(0, prev - 0.5));
      // Simulate street changes
      if (Math.random() > 0.8) {
        setCurrentStreet('Tom Mboya Street');
        setNextStreet('Moi Avenue');
      }
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // For demo, assume currentRide is set
  useEffect(() => {
    // In real app, fetch or get from navigation state
    setCurrentRide({
      passenger: { name: 'John Doe' },
      pickupLocation: 'Westlands',
      dropoffLocation: 'CBD',
      fare: 500
    });
  }, []);

  const handleArrive = async () => {
    // markDriverArrived
    alert('Arrived at pickup!');
  };

  const handleComplete = async () => {
    // completeRide
    alert('Trip completed!');
  };

  if (!currentRide) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#062B32' }}>
        Current Ride Navigation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '600px' }}>
            <MapView
              center={[-1.2921, 36.8219]}
              markers={[]}
              pickup={[-1.2921, 36.8219]}
              dropoff={[-1.2864, 36.8172]}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <LiveTripTracker ride={currentRide} />

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'green' }}>Ride Details</Typography>
              <Typography><strong>Passenger:</strong> {currentRide.passenger.name}</Typography>
              {currentRide.passenger.phoneNumber && (
                <Typography><strong>📞 Phone:</strong> {currentRide.passenger.phoneNumber}</Typography>
              )}
              <Typography><strong>From:</strong> {currentRide.pickupLocation}</Typography>
              <Typography><strong>To:</strong> {currentRide.dropoffLocation}</Typography>
              <Typography><strong>Fare:</strong> KES {currentRide.fare}</Typography>
              {user?.role === 'driver' && currentRide.driver?.phoneNumber && (
                <Typography><strong>🚗 Driver Phone:</strong> {currentRide.driver.phoneNumber}</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Navigation</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: '#f44336' }} />
                <Typography>In {remainingTime.toFixed(1)} min ({remainingDistance.toFixed(1)} km)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DirectionsIcon sx={{ mr: 1, color: '#2196f3' }} />
                <Typography>Turn right onto {nextStreet}</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.9em', color: 'text.secondary' }}>
                Currently on {currentStreet}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">Actions</Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" color="info" onClick={handleArrive} fullWidth>
                  Arrive at Pickup
                </Button>
                <Button variant="contained" color="success" onClick={handleComplete} fullWidth>
                  Complete Trip
                </Button>
                <Button variant="outlined" startIcon={<VolumeUpIcon />} onClick={() => setIsMuted(!isMuted)} fullWidth>
                  {isMuted ? 'Unmute' : 'Mute'} Voice
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CurrentRidePage;