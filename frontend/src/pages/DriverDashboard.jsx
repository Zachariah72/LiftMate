import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAvailableRides, acceptRide, completeRide, markDriverArrived, getDriverStats } from '../api/rides';
import MapView from '../components/MapView';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Card, CardContent, Paper, IconButton, Tabs, Tab, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const DriverDashboard = ({ onStatusUpdate }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [availableRides, setAvailableRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [stats, setStats] = useState({ ordersReceived: { total: 0, today: 0, week: 0, month: 0, year: 0 }, earnings: 0 });
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [statsTab, setStatsTab] = useState(0);
  const [showCurrentRideDetails, setShowCurrentRideDetails] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await getAvailableRides(user.token);
        const newRideCount = res.data.length;
        const previousCount = availableRides.length;

        // Play notification tone if new rides are available
        if (newRideCount > previousCount && previousCount > 0) {
          playNotificationTone();
        }

        setAvailableRides(res.data);
      } catch (err) {
        console.error('Error fetching rides:', err);
      }
    };

    const playNotificationTone = () => {
      try {
        const audio = new Audio('/Tones/mixkit-correct-answer-tone-2870.wav');
        audio.volume = 0.5; // Set volume to 50%
        audio.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };

    fetchRides();
    const interval = setInterval(fetchRides, 5000); // Update every 5 seconds for faster notifications
    return () => clearInterval(interval);
  }, [user.token, availableRides.length]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDriverStats(user.token);
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, [user.token]);

  // Update footer status when currentRide or stats change
  useEffect(() => {
    if (onStatusUpdate) {
      onStatusUpdate({
        currentRide: !!currentRide,
        todaysEarnings: stats.ordersReceived.today || 0
      });
    }
  }, [currentRide, stats.ordersReceived.today, onStatusUpdate]);

  const handleAcceptRide = async (ride) => {
    try {
      await acceptRide(ride._id, user.token);
      setCurrentRide(ride);
      setAvailableRides(availableRides.filter(r => r._id !== ride._id));
      setSelectedRide(null);
      alert('Ride accepted!');
    } catch (err) {
      console.error('Error accepting ride:', err);
      alert('Failed to accept ride');
    }
  };

  const handleCompleteRide = async () => {
    if (!currentRide) return;
    try {
      await completeRide(currentRide._id, user.token);
      alert('Trip completed successfully!');
      setCurrentRide(null);
    } catch (err) {
      console.error('Error completing ride:', err);
      alert('Failed to complete trip');
    }
  };

  const handleArrive = async () => {
    if (!currentRide) return;
    try {
      await markDriverArrived(currentRide._id, user.token);
      alert('Marked as arrived at pickup!');
    } catch (err) {
      console.error('Error marking arrival:', err);
      alert('Failed to mark arrival');
    }
  };

  const markers = [
    ...availableRides.map((ride, index) => ({
      position: [-1.2921 + index * 0.01, 36.8219 + index * 0.01], // Mock coordinates
      title: `Ride from ${ride.pickupLocation} - ${ride.passenger?.name}`,
      icon: 'ride',
      rideData: ride,
      onAccept: handleAcceptRide,
      onClick: () => setSelectedRide(ride)
    })),
    ...acceptedRides.map((ride, index) => ({
      position: [-1.2921 - index * 0.01, 36.8219 - index * 0.01], // Mock coordinates
      title: `Accepted: ${ride.pickupLocation} - ${ride.passenger?.name}`,
      icon: 'accepted',
      rideData: ride
    }))
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3, px: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', borderRadius: 3, p: 3, boxShadow: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: 'white',
          mb: 4,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontWeight: 'bold',
          animation: `${fadeIn} 1s ease-in`
        }}
      >
        🚗 Driver Dashboard
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, width: '100%', justifyContent: 'space-between' }}>
        <Box sx={{ flex: '1 1 calc(20% - 16px)', minWidth: '200px', maxWidth: '250px' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
              borderLeft: '4px solid #4caf50',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animation: `${slideIn} 0.6s ease-out`,
              height: '100%',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                borderLeft: '4px solid #2e7d32'
              }
            }}
            onClick={() => navigate('/ride-requests-list')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{
                backgroundColor: '#4caf50',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <img src="/images/car.png" alt="car" style={{ width: 35, height: 35, filter: 'brightness(0) invert(1)' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>{availableRides.length}</Typography>
              <Typography sx={{ color: '#388e3c', fontWeight: 'medium' }}>Available Requests</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 calc(20% - 16px)', minWidth: '200px', maxWidth: '250px' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
              borderLeft: '4px solid #ff9800',
              cursor: currentRide ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              animation: `${slideIn} 0.6s ease-out 0.1s both`,
              height: '100%',
              '&:hover': currentRide ? {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
                borderLeft: '4px solid #f57c00'
              } : {}
            }}
            onClick={() => currentRide && navigate('/current-ride')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{
                backgroundColor: '#ff9800',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <LocationOnIcon sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>{currentRide ? 1 : 0}</Typography>
              <Typography sx={{ color: '#e65100', fontWeight: 'medium' }}>Current Ride</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 calc(20% - 16px)', minWidth: '200px', maxWidth: '250px' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
              borderLeft: '4px solid #e91e63',
              transition: 'all 0.3s ease',
              animation: `${slideIn} 0.6s ease-out 0.2s both`,
              height: '100%',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(233, 30, 99, 0.3)',
                borderLeft: '4px solid #c2185b'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{
                backgroundColor: '#e91e63',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <ReceiptIcon sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#c2185b' }}>{stats.ordersReceived.total}</Typography>
              <Typography sx={{ color: '#ad1457', fontWeight: 'medium' }}>Orders Received</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 calc(20% - 16px)', minWidth: '200px', maxWidth: '250px' }}>
          <Card
            sx={{
              background: currentRide ? 'linear-gradient(135deg, #fff9c4 0%, #fff176 100%)' : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              border: `2px solid ${currentRide ? '#ffeb3b' : '#bdbdbd'}`,
              transition: 'all 0.3s ease',
              animation: `${slideIn} 0.6s ease-out 0.3s both`,
              height: '100%',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(255, 235, 59, 0.3)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{
                backgroundColor: currentRide ? '#ffeb3b' : '#bdbdbd',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <img src="/images/car.png" alt="car" style={{ width: 30, height: 30, filter: currentRide ? 'none' : 'grayscale(100%)' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: currentRide ? '#f57c00' : '#757575' }}>
                {currentRide ? 'Active' : 'No Active'}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: currentRide ? '#f57c00' : '#757575' }}>
                {currentRide ? 'Ride' : 'Accept ride'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 calc(20% - 16px)', minWidth: '200px', maxWidth: '250px' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              borderLeft: '4px solid #2196f3',
              transition: 'all 0.3s ease',
              animation: `${slideIn} 0.6s ease-out 0.4s both`,
              height: '100%',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                borderLeft: '4px solid #1976d2'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                  backgroundColor: '#2196f3',
                  borderRadius: '50%',
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}>
                  <AttachMoneyIcon sx={{ fontSize: 30, color: 'white' }} />
                </Box>
                <IconButton
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {balanceVisible ? <VisibilityIcon sx={{ color: 'white' }} /> : <VisibilityOffIcon sx={{ color: 'white' }} />}
                </IconButton>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {balanceVisible ? `KES ${stats.earnings}` : '****'}
              </Typography>
              <Typography sx={{ color: '#1565c0', fontWeight: 'medium' }}>Total Earnings</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Orders Received Tabs */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Orders Received</Typography>
          <Tabs value={statsTab} onChange={(e, newValue) => setStatsTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Today" />
            <Tab label="Week" />
            <Tab label="Month" />
            <Tab label="Year" />
          </Tabs>
          <Typography variant="h4" sx={{ textAlign: 'center', color: '#e91e63' }}>
            {statsTab === 0 ? stats.ordersReceived.today :
             statsTab === 1 ? stats.ordersReceived.week :
             statsTab === 2 ? stats.ordersReceived.month :
             stats.ordersReceived.year}
          </Typography>
        </CardContent>
      </Card>

      {/* Map */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper sx={{ p: 0, height: currentRide ? '700px' : '600px' }}>
            <Typography variant="h6" gutterBottom sx={{ p: 2 }}>Live Map{currentRide ? ' - Ride in Progress' : ''}</Typography>
            <MapView
              center={[-1.2921, 36.8219]}
              markers={markers}
              pickup={currentRide ? [parseFloat(currentRide.pickupLocation.split(',')[0]), parseFloat(currentRide.pickupLocation.split(',')[1])] : null}
              dropoff={currentRide ? [parseFloat(currentRide.dropoffLocation.split(',')[0]), parseFloat(currentRide.dropoffLocation.split(',')[1])] : null}
              routes={[]} // Add routes if needed
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Current Ride Details */}
      {currentRide && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#e8f5e8', border: '2px solid #4caf50' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'green', mb: 2 }}>Current Ride Details</Typography>
                <Typography><strong>Rider:</strong> {currentRide.passenger?.name}</Typography>
                <Typography><strong>From:</strong> {currentRide.pickupLocation}</Typography>
                <Typography><strong>To:</strong> {currentRide.dropoffLocation}</Typography>
                <Typography><strong>Fare:</strong> KES {currentRide.fare}</Typography>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="info" onClick={handleArrive}>
                    Arrive at Pickup
                  </Button>
                  <Button variant="contained" color="success" onClick={handleCompleteRide}>
                    Complete Trip
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Current Ride Details */}
      {currentRide && showCurrentRideDetails && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <Card sx={{ backgroundColor: '#e8f5e8', border: '2px solid #4caf50' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'green', mb: 2 }}>Current Ride Details</Typography>
                <Typography><strong>Rider:</strong> {currentRide.passenger?.name}</Typography>
                <Typography><strong>From:</strong> {currentRide.pickupLocation}</Typography>
                <Typography><strong>To:</strong> {currentRide.dropoffLocation}</Typography>
                <Typography><strong>Fare:</strong> KES {currentRide.fare}</Typography>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="info" onClick={handleArrive}>
                    Arrive at Pickup
                  </Button>
                  <Button variant="contained" color="success" onClick={handleCompleteRide}>
                    Complete Trip
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Ride Request Dialog */}
      {selectedRide && (
        <Dialog open={!!selectedRide} onClose={() => setSelectedRide(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#062B32', color: 'white' }}>New Ride Request</DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography><strong>Rider:</strong> {selectedRide.passenger?.name}</Typography>
            <Typography><strong>Email:</strong> {selectedRide.passenger?.email}</Typography>
            <Typography><strong>Pickup:</strong> {selectedRide.pickupLocation}</Typography>
            <Typography><strong>Dropoff:</strong> {selectedRide.dropoffLocation}</Typography>
            <Typography><strong>Fare:</strong> KES {selectedRide.fare}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRide(null)}>Decline</Button>
            <Button onClick={() => handleAcceptRide(selectedRide)} variant="contained" color="primary">
              Accept Ride
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default DriverDashboard;