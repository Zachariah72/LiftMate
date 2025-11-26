import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAvailableRides, acceptRide } from '../api/rides';
import { Container, Typography, Button, Card, CardContent, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip, Divider } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatIcon from '@mui/icons-material/Chat';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';

const RideRequestsList = () => {
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await getAvailableRides(user.token);
        setRides(res.data);
      } catch (err) {
        console.error('Error fetching rides:', err);
      }
    };
    fetchRides();
  }, [user.token]);

  const handleAcceptRide = async (ride) => {
    try {
      await acceptRide(ride._id, user.token);
      setRides(rides.filter(r => r._id !== ride._id));
      setSelectedRide(null);
      alert('Ride accepted!');
    } catch (err) {
      console.error('Error accepting ride:', err);
      alert('Failed to accept ride');
    }
  };

  const handleShare = (ride) => {
    const message = `LiftMate Ride Request:\nPickup: ${ride.pickupLocation}\nDropoff: ${ride.dropoffLocation}\nFare: KES ${ride.fare}\nRequester: ${ride.passenger?.name}\nTime: ${new Date(ride.createdAt).toLocaleString()}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDecline = (ride) => {
    // For now, just remove from local list
    setRides(rides.filter(r => r._id !== ride._id));
    alert('Ride declined');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#062B32' }}>
        Available Ride Requests
      </Typography>
      <Grid container spacing={3}>
        {rides.map((ride) => (
          <Grid item xs={12} md={6} key={ride._id}>
            <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#062B32', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{ride.passenger?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{ride.passenger?.email}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#4caf50' }} />
                  <Typography><strong>Pickup:</strong> {ride.pickupLocation}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#f44336' }} />
                  <Typography><strong>Dropoff:</strong> {ride.dropoffLocation}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: '#ff9800' }} />
                  <Typography><strong>Fare:</strong> KES {ride.fare}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 1, color: '#2196f3' }} />
                  <Typography><strong>Time:</strong> {new Date(ride.createdAt).toLocaleString()}</Typography>
                </Box>
                {ride.driver && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Assigned Driver</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsCarIcon sx={{ mr: 1, color: '#9c27b0' }} />
                      <Typography>{ride.driver.name} - {ride.driver.carRegNumber} ({ride.driver.carColor})</Typography>
                    </Box>
                  </Box>
                )}
                <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => setSelectedRide(ride)} sx={{ flex: 1 }}>
                    Accept Ride
                  </Button>
                  <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => handleDecline(ride)}>
                    Decline
                  </Button>
                  <Button variant="outlined" startIcon={<ChatIcon />} onClick={() => alert('Chat feature coming soon!')}>
                    Chat
                  </Button>
                  <Button variant="outlined" startIcon={<CallIcon />} onClick={() => window.open(`tel:${ride.passenger?.phone || '0712345678'}`, '_self')}>
                    Call
                  </Button>
                  <Button variant="outlined" startIcon={<SmsIcon />} onClick={() => window.open(`sms:${ride.passenger?.phone || '0712345678'}`, '_self')}>
                    SMS
                  </Button>
                  <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => handleShare(ride)}>
                    Share
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Accept Ride Dialog */}
      {selectedRide && (
        <Dialog open={!!selectedRide} onClose={() => setSelectedRide(null)}>
          <DialogTitle>Confirm Accept Ride</DialogTitle>
          <DialogContent>
            <Typography>Accept ride from {selectedRide.passenger?.name}?</Typography>
            <Typography>Pickup: {selectedRide.pickupLocation}</Typography>
            <Typography>Dropoff: {selectedRide.dropoffLocation}</Typography>
            <Typography>Fare: KES {selectedRide.fare}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRide(null)}>Cancel</Button>
            <Button onClick={() => handleAcceptRide(selectedRide)} variant="contained">Accept</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default RideRequestsList;