// src/pages/Home.jsx
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  keyframes,
  Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlightIcon from '@mui/icons-material/Flight';
import BusinessIcon from '@mui/icons-material/Business';
import HelpIcon from '@mui/icons-material/Help';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

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
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url(/images/pexels-alina-kurson-80193566-8732920.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: { xs: '20px', md: '40px 20px' },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, animation: `${fadeIn} 1s ease-out` }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              animation: `${pulse} 2s infinite`
            }}
          >
            <DirectionsCarIcon sx={{ fontSize: 60, color: 'white' }} />
          </Avatar>

          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              animation: `${slideIn} 1s ease-out 0.2s both`
            }}
          >
            🚗 LiftMate
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'white',
              mb: 4,
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: '600px',
              mx: 'auto',
              animation: `${slideIn} 1s ease-out 0.4s both`
            }}
          >
            Your smart ride-sharing and transportation management platform.
            <br />
            <Box component="span" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
              Safe • Reliable • Fast
            </Box>
          </Typography>

          {/* Ride Request Form */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '600px',
              mb: 4,
              animation: `${fadeIn} 1s ease-out 0.6s both`
            }}
          >
            <TextField
              fullWidth
              label="Enter pickup location"
              variant="outlined"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              InputProps={{
                startAdornment: <LocationOnIcon sx={{ color: '#667eea', mr: 1 }} />
              }}
              sx={{
                mb: 2,
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' }
                }
              }}
            />
            <TextField
              fullWidth
              label="Enter destination"
              variant="outlined"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              InputProps={{
                startAdornment: <LocationOnIcon sx={{ color: '#667eea', mr: 1 }} />
              }}
              sx={{
                mb: 2,
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' }
                }
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/ride-request')}
            >
              🚀 See Prices & Book Now
            </Button>
          </Box>

          {!user && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                animation: `${fadeIn} 1s ease-out 0.8s both`
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  paddingX: 4,
                  paddingY: 1.5,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': {
                    backgroundColor: 'white',
                    color: '#667eea',
                    borderColor: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255,255,255,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🔐 Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
                  color: '#1e0a78',
                  paddingX: 4,
                  paddingY: 1.5,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(255, 215, 0, 0.6)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                ✨ Create Account
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Ride Options Section */}
      <Box
        sx={{
          padding: { xs: '40px 20px', md: '80px 20px' },
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 0
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: '#333',
              animation: `${fadeIn} 1s ease-out`
            }}
          >
            🚗 Ride Options
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: '#666',
              maxWidth: '800px',
              mx: 'auto',
              animation: `${fadeIn} 1s ease-out 0.2s both`
            }}
          >
            There's more than one way to move with LiftMate, no matter where you are or where you're headed next.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-out 0.4s both`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                    }}
                  >
                    <DirectionsCarIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Economy
                  </Typography>
                  <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                    Affordable rides for everyday travel. Perfect for your daily commute or budget-conscious trips.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-out 0.6s both`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Premium
                  </Typography>
                  <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                    Comfortable rides with extra amenities. Luxury vehicles for special occasions or business travel.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-out 0.8s both`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Shared
                  </Typography>
                  <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                    Share your ride and save on costs. Environmentally friendly option for multiple passengers.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Airports Section */}
      <Box
        sx={{
          padding: { xs: '40px 20px', md: '80px 20px' },
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
          position: 'relative'
        }}
      >
        <Box sx={{ textAlign: 'center', animation: `${fadeIn} 1s ease-out` }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <FlightIcon sx={{ fontSize: 50, color: 'white' }} />
          </Avatar>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: '#333',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            700+ Airports
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: '#666',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            You can request a ride to and from most major airports. Schedule a ride to the airport for one less thing to worry about.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/airports')}
          >
            ✈️ Search Airports
          </Button>
        </Box>
      </Box>

      {/* Cities Section */}
      <Box
        sx={{
          padding: { xs: '40px 20px', md: '80px 20px' },
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          position: 'relative'
        }}
      >
        <Box sx={{ textAlign: 'center', animation: `${fadeIn} 1s ease-out` }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
            }}
          >
            <LocationOnIcon sx={{ fontSize: 50, color: 'white' }} />
          </Avatar>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: '#333',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            15,000+ Cities
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: '#666',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            The app is available in thousands of cities worldwide, so you can request a ride even when you're far from home.
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/cities')}
          >
            🌍 Search Cities
          </Button>
        </Box>
      </Box>

      {/* Business Solutions */}
      <Box
        sx={{
          padding: { xs: '40px 20px', md: '80px 20px' },
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
        }}
      >
        <Box sx={{ textAlign: 'center', animation: `${fadeIn} 1s ease-out` }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <BusinessIcon sx={{ fontSize: 50, color: 'white' }} />
          </Avatar>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: '#333',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Business Solutions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              color: '#666',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Get information about how companies leverage LiftMate for Business.
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-out 0.2s both`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  ✈️ Business Travel
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                  Corporate travel management
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-out 0.4s both`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  🎁 Courtesy Rides
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                  Guest and VIP transportation
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-out 0.6s both`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  🍽️ Meal Programs
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                  Food delivery services
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `${slideIn} 1s ease-out 0.8s both`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  📦 Item Delivery
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                  Package and parcel delivery
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            sx={{
              px: 6,
              py: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 3,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 36px rgba(102, 126, 234, 0.6)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            🚀 Get Started Today
          </Button>
        </Box>
      </Box>

      {/* FAQs */}
      <Box
        sx={{
          padding: { xs: '40px 20px', md: '80px 20px' },
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}
      >
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 6, animation: `${fadeIn} 1s ease-out` }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 3,
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
              }}
            >
              <HelpIcon sx={{ fontSize: 50, color: 'white' }} />
            </Avatar>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#333',
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Frequently Asked Questions
            </Typography>
          </Box>

          <Box sx={{ animation: `${fadeIn} 1s ease-out 0.2s both` }}>
            <Accordion
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.04)' },
                  borderRadius: 2
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                  📦 Can I have a lost item delivered to me?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(102, 126, 234, 0.02)', borderRadius: '0 0 8px 8px' }}>
                <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                  Yes, we can help arrange delivery of lost items. Please contact our support team with your ride details and item description.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.04)' },
                  borderRadius: 2
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                  🚗 Can I rent a car using LiftMate?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(102, 126, 234, 0.02)', borderRadius: '0 0 8px 8px' }}>
                <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                  Currently, we focus on ride-sharing, but car rental options may be available in the future. Stay tuned for updates!
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.04)' },
                  borderRadius: 2
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                  👥 Can I request a ride that picks up friends in different locations?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(102, 126, 234, 0.02)', borderRadius: '0 0 8px 8px' }}>
                <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                  Yes, you can add multiple stops for your ride. Our shared ride options are perfect for group travel with different pickup points.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.04)' },
                  borderRadius: 2
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                  🚕 Can I request a taxi on LiftMate?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(102, 126, 234, 0.02)', borderRadius: '0 0 8px 8px' }}>
                <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                  Our service provides ride-sharing options similar to taxis, with the added benefit of potentially lower costs through shared rides.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.04)' },
                  borderRadius: 2
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                  👨‍👩‍👧‍👦 Is there a LiftMate ride option for 5 people?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(102, 126, 234, 0.02)', borderRadius: '0 0 8px 8px' }}>
                <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                  Yes, we offer rides that can accommodate up to 5 passengers. Our larger vehicles are perfect for families or group travel.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
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
