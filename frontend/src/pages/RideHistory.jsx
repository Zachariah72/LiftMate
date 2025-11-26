import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getRides, payRide } from '../api/rides';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';

const RideHistory = () => {
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await getRides(user.token);
        setRides(res.data);
      } catch (err) {
        console.error(err);
        alert('Error fetching ride history.');
      }
    };
    fetchRides();
  }, [user.token]);

  const handlePayment = async (ride) => {
    try {
      const phone = prompt('Enter your phone number for M-Pesa');
      if (!phone) return;

      await payRide(phone, ride.fare || ride.price, user.token);
      alert('M-Pesa STK Push sent! Check your phone.');
    } catch (err) {
      console.error(err);
      alert('Payment failed.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" className="bungee-spice-regular" gutterBottom>
          My Ride History
        </Typography>

        {rides.length === 0 && <Typography>No rides found.</Typography>}

        {rides.map((ride) => (
          <Card key={ride._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography><strong>Pickup:</strong> {ride.pickupLocation || ride.pickup}</Typography>
              <Typography><strong>Dropoff:</strong> {ride.dropoffLocation || ride.destination}</Typography>
              <Typography><strong>Fare:</strong> KES {ride.fare || ride.price}</Typography>
              <Typography><strong>Status:</strong> {ride.status}</Typography>
              <Typography><strong>Requested:</strong> {new Date(ride.createdAt).toLocaleString()}</Typography>

              {ride.status !== 'completed' && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={() => handlePayment(ride)}
                >
                  Pay via M-Pesa
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default RideHistory;
