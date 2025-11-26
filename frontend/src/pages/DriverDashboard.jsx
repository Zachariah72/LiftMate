import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAvailableRides, acceptRide, completeRide, markDriverArrived, getDriverStats } from '../api/rides';
import MapView from '../components/MapView';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Card, CardContent, Paper, IconButton, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReceiptIcon from '@mui/icons-material/Receipt';

const DriverDashboard = () => {
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
        setAvailableRides(res.data);
      } catch (err) {
        console.error('Error fetching rides:', err);
      }
    };
    fetchRides();
    const interval = setInterval(fetchRides, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [user.token]);

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
      onClick: () => setSelectedRide(ride)
    })),
    ...acceptedRides.map((ride, index) => ({
      position: [-1.2921 - index * 0.01, 36.8219 - index * 0.01], // Mock coordinates
      title: `Accepted: ${ride.pickupLocation} - ${ride.passenger?.name}`,
      icon: 'accepted'
    }))
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3, px: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#062B32', mb: 4 }}>
        Driver Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2}>
          <Card sx={{ backgroundColor: '#e8f5e8', borderLeft: '4px solid #4caf50', cursor: 'pointer' }} onClick={() => navigate('/ride-requests-list')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <img src="/images/car.png" alt="car" style={{ width: 40, height: 40 }} />
              <Typography variant="h5">{availableRides.length}</Typography>
              <Typography>Available Rides</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ backgroundColor: '#fff3e0', borderLeft: '4px solid #ff9800', cursor: currentRide ? 'pointer' : 'default' }} onClick={() => currentRide && navigate('/current-ride')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocationOnIcon sx={{ fontSize: 40, color: '#ff9800' }} />
              <Typography variant="h5">{currentRide ? 1 : 0}</Typography>
              <Typography>Current Ride</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ backgroundColor: '#fce4ec', borderLeft: '4px solid #e91e63' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 40, color: '#e91e63' }} />
              <Typography variant="h5">{stats.ordersReceived.total}</Typography>
              <Typography>Orders Received</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{
            backgroundColor: currentRide ? '#fff9c4' : '#f5f5f5',
            border: `2px solid ${currentRide ? '#ffeb3b' : '#bdbdbd'}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <img src="/images/car.png" alt="car" style={{ width: 40, height: 40, filter: currentRide ? 'none' : 'grayscale(100%)' }} />
              <Typography variant="h5" sx={{ color: currentRide ? '#f57c00' : '#757575' }}>
                {currentRide ? 'Active' : 'No Active'}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: currentRide ? '#f57c00' : '#757575' }}>
                {currentRide ? 'Ride' : 'Accept ride'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
            <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                <IconButton onClick={() => setBalanceVisible(!balanceVisible)} sx={{ ml: 1 }}>
                  {balanceVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Box>
              <Typography variant="h5">
                {balanceVisible ? `KES ${stats.earnings}` : '****'}
              </Typography>
              <Typography>Total Earnings</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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