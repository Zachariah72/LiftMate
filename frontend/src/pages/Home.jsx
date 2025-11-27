// src/pages/Home.jsx
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, Button, TextField, Grid, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/ride-request');
    }
  }, [user, navigate]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        className="hero"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/pexels-alina-kurson-80193566-8732920.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '40px 20px'
        }}
      >
        <Typography
          variant="h2"
          className="bungee-spice-regular"
          gutterBottom
          sx={{
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            mb: 2
          }}
        >
          Welcome to LiftMate
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            mb: 4
          }}
        >
          Your smart ride-sharing and transportation management platform.
        </Typography>

        {/* Ride Request Form */}
        <Box sx={{ width: '100%', maxWidth: '600px', mb: 4 }}>
          <TextField
            fullWidth
            label="Enter pickup location"
            variant="outlined"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
          <TextField
            fullWidth
            label="Enter destination"
            variant="outlined"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            sx={{ mb: 2, backgroundColor: 'white' }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#000',
              color: 'white',
              paddingY: 1.5,
              '&:hover': { backgroundColor: '#333' }
            }}
            onClick={() => navigate('/ride-request')}
          >
            See prices
          </Button>
        </Box>

        {!user && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#1e0a78',
                color: 'white',
                paddingX: 3,
                paddingY: 1.5,
                borderRadius: '6px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#ffd700',
                  color: '#1e0a78',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: '#ffd700',
                color: '#1e0a78',
                paddingX: 3,
                paddingY: 1.5,
                borderRadius: '6px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1e0a78',
                  color: '#ffd700',
                },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>

      {/* Ride Options Section */}
      <Box sx={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Ride options
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          There's more than one way to move with LiftMate, no matter where you are or where you're headed next.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Economy</Typography>
                <Typography>Affordable rides for everyday travel.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Premium</Typography>
                <Typography>Comfortable rides with extra amenities.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Shared</Typography>
                <Typography>Share your ride and save on costs.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Airports Section */}
      <Box sx={{ padding: '60px 20px' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          700+ airports
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          You can request a ride to and from most major airports. Schedule a ride to the airport for one less thing to worry about.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/airports')}>Search airports</Button>
        </Box>
      </Box>

      {/* Cities Section */}
      <Box sx={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          15,000+ cities
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          The app is available in thousands of cities worldwide, so you can request a ride even when you're far from home.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/cities')}>Search cities</Button>
        </Box>
      </Box>

      {/* Business Solutions */}
      <Box sx={{ padding: '60px 20px' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Looking for business solutions?
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          Get information about how companies leverage LiftMate for Business.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">Business travel</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">Courtesy rides</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">Meal programs</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">Item delivery</Typography>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" sx={{ backgroundColor: '#000', color: 'white' }}>Get started</Button>
        </Box>
      </Box>

      {/* FAQs */}
      <Box sx={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Frequently asked questions
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Can I have a lost item delivered to me?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Yes, we can help arrange delivery of lost items.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Can I rent a car using LiftMate?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Currently, we focus on ride-sharing, but car rental options may be available in the future.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Can I request a ride that picks up friends in different locations?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Yes, you can add multiple stops for your ride.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Can I request a taxi on LiftMate?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Our service provides ride-sharing options similar to taxis.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Is there a LiftMate ride option for 5 people?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Yes, we offer rides that can accommodate up to 5 passengers.</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Download App */}
      <Box sx={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h3" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          Download the LiftMate app
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
          Scan to download - Available on Android & iOS
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: 200,
                height: 200,
                backgroundColor: '#fff',
                border: '2px solid #667eea',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: 3
              }}
            >
              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                📱 QR Code<br/>Coming Soon
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              Scan with your phone camera
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
              Get the app for:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AndroidIcon />}
                sx={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  py: 1.5,
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Download for Android
              </Button>
              <Button
                variant="contained"
                startIcon={<AppleIcon />}
                sx={{
                  backgroundColor: '#000',
                  color: 'white',
                  py: 1.5,
                  '&:hover': { backgroundColor: '#333' }
                }}
              >
                Download for iOS
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 4, color: '#666' }}>
          Join millions of users worldwide • Safe • Reliable • Fast
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
