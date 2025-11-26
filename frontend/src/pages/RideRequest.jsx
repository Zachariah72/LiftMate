import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createRide, payRide, getAvailableDrivers, getRideById, completeRide } from '../api/rides';
import { updateLocation } from '../api/auth';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl, Card, CardContent, Autocomplete, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MapView from '../components/MapView';
import api from '../api/axios';

const RideRequest = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [ride, setRide] = useState(null);
  const [fare, setFare] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyDropoffPlaces, setNearbyDropoffPlaces] = useState([]);
  const [voiceType, setVoiceType] = useState('female');
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverArrived, setDriverArrived] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (location.state?.location) {
      // Assume it's for pickup or dropoff, for simplicity set to pickup
      setPickup(location.state.location);
    }

    // Get user's live location
    const getLocation = async () => {
      let places;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            // Update location in backend
            updateLocation(latitude, longitude, user.token);

            // Reverse geocode to get address
            const address = await reverseGeocode(latitude, longitude);
            setPickup(address);

            // Fetch nearby places
            places = await fetchNearbyPlaces(latitude, longitude);
            setNearbyPlaces([{ label: address, value: [latitude, longitude] }, ...places]);
            setPickup(address);

            // Simulate nearby drivers
            const drivers = [
              { id: 1, name: 'Driver 1', location: [latitude + 0.01, longitude + 0.01] },
              { id: 2, name: 'Driver 2', location: [latitude - 0.01, longitude - 0.01] },
              { id: 3, name: 'Driver 3', location: [latitude + 0.005, longitude - 0.005] },
            ];
            setNearbyDrivers(drivers);
          },
          async (error) => {
            console.error('Error getting location:', error);
            // Simulate location for demo
            const latitude = -1.2921; // Nairobi
            const longitude = 36.8219;
            setUserLocation([latitude, longitude]);
            updateLocation(latitude, longitude, user.token);

            const address = await reverseGeocode(latitude, longitude);
            setPickup(address);

            const drivers = [
              { id: 1, name: 'Driver 1', location: [latitude + 0.01, longitude + 0.01] },
              { id: 2, name: 'Driver 2', location: [latitude - 0.01, longitude - 0.01] },
              { id: 3, name: 'Driver 3', location: [latitude + 0.005, longitude - 0.005] },
            ];
            setNearbyDrivers(drivers);
          }
        );
      } else {
        // Fallback for demo
        const latitude = -1.2921;
        const longitude = 36.8219;
        setUserLocation([latitude, longitude]);
        updateLocation(latitude, longitude, user.token);

        const address = await reverseGeocode(latitude, longitude);
        setPickup(address);

        places = await fetchNearbyPlaces(latitude, longitude);
        setNearbyPlaces([{ label: address, value: [latitude, longitude] }, ...places]);
        setPickup(address);

        let places = await fetchNearbyPlaces(latitude, longitude);
        setNearbyPlaces(places);

        const drivers = [
          { id: 1, name: 'Driver 1', location: [latitude + 0.01, longitude + 0.01] },
          { id: 2, name: 'Driver 2', location: [latitude - 0.01, longitude - 0.01] },
          { id: 3, name: 'Driver 3', location: [latitude + 0.005, longitude - 0.005] },
        ];
        setNearbyDrivers(drivers);
      }
    };

    getLocation();

    // Fetch available drivers
    const fetchDrivers = async () => {
      try {
        const res = await getAvailableDrivers();
        // Simulate more drivers if less than 50
        let drivers = res.data;
        while (drivers.length < 50) {
          drivers.push({
            name: `Driver ${drivers.length + 1}`,
            location: {
              coordinates: [
                (userLocation ? userLocation[1] : 36.8219) + (Math.random() - 0.5) * 0.1,
                (userLocation ? userLocation[0] : -1.2921) + (Math.random() - 0.5) * 0.1
              ]
            }
          });
        }
        setAvailableDrivers(drivers.slice(0, 50));
      } catch (err) {
        console.error('Error fetching drivers:', err);
        // Fallback to simulated drivers
        const drivers = [];
        for (let i = 0; i < 50; i++) {
          drivers.push({
            name: `Driver ${i + 1}`,
            location: {
              coordinates: [
                (userLocation ? userLocation[1] : 36.8219) + (Math.random() - 0.5) * 0.1,
                (userLocation ? userLocation[0] : -1.2921) + (Math.random() - 0.5) * 0.1
              ]
            }
          });
        }
        setAvailableDrivers(drivers);
      }
    };
    fetchDrivers();

    // Update every 30 seconds
    const interval = setInterval(fetchDrivers, 30000);
    return () => clearInterval(interval);
  }, [location.state, user.token]);

  // Fetch coordinates from OpenStreetMap
  const fetchCoordinates = async (address) => {
    const res = await api.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
    if (res.data.length) {
      const { lat, lon } = res.data[0];
      return [parseFloat(lat), parseFloat(lon)];
    }
    return null;
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat, lon) => {
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      console.error('Invalid coordinates:', lat, lon);
      return 'Invalid location';
    }
    try {
      const res = await api.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      if (res.data && res.data.display_name) {
        return res.data.display_name;
      }
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (err) {
      console.error('Reverse geocode error:', err);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  // Fetch nearby places
  const fetchNearbyPlaces = async (lat, lon) => {
    try {
      const res = await api.get(`https://nominatim.openstreetmap.org/search?format=json&limit=10&q=poi&bounded=1&viewbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}`);
      return res.data.map((place, index) => ({
        label: `${place.display_name} (${index})`,
        value: [parseFloat(place.lat), parseFloat(place.lon)]
      }));
    } catch (err) {
      console.error('Error fetching nearby places:', err);
      return [];
    }
  };

  // Fetch places by query
  const fetchPlacesByQuery = async (query) => {
    if (!query) return [];
    const res = await api.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10`);
    return res.data.map(place => ({
      label: place.display_name,
      value: [parseFloat(place.lat), parseFloat(place.lon)]
    }));
  };

  // Speak text with selected voice
  const speak = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name.toLowerCase().includes(voiceType));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    speechSynthesis.speak(utterance);
  };

  // Speak instructions step by step
  const speakInstructions = (instructions) => {
    const steps = instructions.split('.').filter(step => step.trim());
    let index = 0;
    const speakNext = () => {
      if (index < steps.length) {
        speak(steps[index].trim());
        index++;
        setTimeout(speakNext, 5000); // Speak next in 5 seconds
      }
    };
    speakNext();
  };

  const handleAddressSearch = async () => {
    try {
      const pickupCoord = await fetchCoordinates(pickup);
      const dropoffCoord = await fetchCoordinates(dropoff);

      if (!pickupCoord || !dropoffCoord) {
        alert('Invalid pickup or dropoff address');
        return;
      }

      setPickupCoords(pickupCoord);
      setDropoffCoords(dropoffCoord);

      // Mock routes for demo
      const distance = Math.sqrt((pickupCoord[0] - dropoffCoord[0]) ** 2 + (pickupCoord[1] - dropoffCoord[1]) ** 2) * 111; // rough km
      const fetchedRoutes = [
        {
          coords: [pickupCoord, dropoffCoord],
          distance: distance * 1000,
          duration: Math.ceil(distance / 50 * 60), // assume 50 km/h
        },
        {
          coords: [pickupCoord, [pickupCoord[0] + 0.01, pickupCoord[1] + 0.01], dropoffCoord],
          distance: distance * 1000 + 1000,
          duration: Math.ceil((distance + 1) / 50 * 60),
        }
      ];

      setRoutes(fetchedRoutes);
      setSelectedRouteIndex(0);
      setFare(Math.max(100, Math.round(fetchedRoutes[0].distance / 1000) * 50));
    } catch (err) {
      console.error(err);
      alert('Error fetching coordinates or routes.');
    }
  };

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index);
    const distanceKm = routes[index].distance / 1000;
    setFare(Math.max(100, Math.round(distanceKm * 50)));
  };

  const handleRequestRide = async () => {
    try {
      const selectedRoute = routes[selectedRouteIndex];
      const rideFare = selectedRoute ? Math.max(100, Math.round(selectedRoute.distance / 1000) * 50) : 100;

      const res = await createRide(
        {
          pickupLocation: pickup,
          dropoffLocation: dropoff,
          fare: rideFare,
        },
        user.token
      );

      setRide({ ...res.data.ride, fare: rideFare });

      // Poll for status updates
      const pollStatus = async () => {
        try {
          const rideRes = await getRideById(res.data.ride._id, user.token);
          const updatedRide = rideRes.data;
          setRide({ ...updatedRide, fare: rideFare });

          if (updatedRide.status === 'accepted' && !driverLocation) {
            // Driver accepted, start tracking
            alert('Driver is on his/her way!');
            // Simulate driver starting from a distance
            setDriverLocation([-1.2921 + 0.05, 36.8219 + 0.05]); // Initial driver position
            startDriverTracking();
          }

          if (updatedRide.driverArrived && !driverArrived) {
            setDriverArrived(true);
            alert('Driver has arrived at the pickup point!');
            // Stop tracking
            clearInterval(trackingInterval);
            setDriverLocation(pickupCoords); // Set to exact pickup
          }

          if (updatedRide.status === 'completed') {
            alert('Thank you for using LiftMate! Trip completed.');
            clearInterval(interval);
            clearInterval(trackingInterval);
          }
        } catch (err) {
          console.error('Error polling ride status:', err);
        }
      };

      let trackingInterval;
      const startDriverTracking = () => {
        trackingInterval = setInterval(() => {
          setDriverLocation(prev => {
            if (!prev) return prev;
            const [lat, lon] = prev;
            const targetLat = pickupCoords[0];
            const targetLon = pickupCoords[1];
            const step = 0.001; // Move step
            const newLat = lat + (targetLat - lat) * step;
            const newLon = lon + (targetLon - lon) * step;
            const distance = Math.sqrt((newLat - targetLat) ** 2 + (newLon - targetLon) ** 2);
            if (distance < 0.002) { // Close enough
              if (!driverArrived) {
                setDriverArrived(true);
                alert('Driver has arrived at the pickup point!');
              }
              return [targetLat, targetLon];
            }
            return [newLat, newLon];
          });
        }, 2000); // Update every 2 seconds
      };

      pollStatus();
      const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds
    } catch (err) {
      console.error(err);
      alert('Error requesting ride.');
    }
  };

  const handlePayment = async () => {
    if (!ride) return;
    try {
      const phone = prompt('Enter your phone number for M-Pesa');
      if (!phone) return;
      await payRide(phone, ride.fare, user.token);
      alert('M-Pesa STK Push sent! Check your phone.');
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    }
  };

  const handleCompleteRide = async () => {
    if (!ride) return;
    try {
      await completeRide(ride._id, user.token);
      alert('Trip completed successfully!');
      setRide({ ...ride, status: 'completed' });
    } catch (err) {
      console.error(err);
      alert('Failed to complete trip');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" className="bungee-spice-regular" gutterBottom align="center" sx={{ color: '#062B32' }}>
        Request a Ride
      </Typography>

      {!ride ? (
        <Card sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" gutterBottom>Enter Ride Details</Typography>
          <Autocomplete
            fullWidth
            options={nearbyPlaces.map(p => p.label)}
            value={pickup}
            onChange={(e, newValue) => setPickup(newValue)}
            onInputChange={(e, newInputValue) => setPickup(newInputValue)}
            renderInput={(params) => <TextField {...params} label="Pickup Location" margin="normal" />}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            fullWidth
            options={nearbyDropoffPlaces.map(p => p.label)}
            value={dropoff}
            onChange={(e, newValue) => setDropoff(newValue)}
            onInputChange={async (e, newInputValue) => {
              setDropoff(newInputValue);
              const places = await fetchPlacesByQuery(newInputValue);
              setNearbyDropoffPlaces(places);
            }}
            renderInput={(params) => <TextField {...params} label="Dropoff Location" margin="normal" />}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>Voice Type</InputLabel>
              <Select value={voiceType} onChange={(e) => setVoiceType(e.target.value)} label="Voice Type">
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted && 'speechSynthesis' in window) {
                speechSynthesis.cancel(); // Stop any ongoing speech
              }
            }} color={isMuted ? 'error' : 'primary'}>
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Box>

          <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: '#062B32', '&:hover': { backgroundColor: '#054a4f' } }} onClick={handleAddressSearch}>
            Show Routes
          </Button>

          {routes.length > 0 && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Route</InputLabel>
              <Select value={selectedRouteIndex} onChange={(e) => handleSelectRoute(e.target.value)}>
                {routes.map((r, i) => (
                  <MenuItem key={i} value={i}>
                    Route {i + 1} - {(r.distance / 1000).toFixed(2)} km, {r.duration} min
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {pickupCoords && dropoffCoords && (
            <>
              <Box sx={{ mt: 3, mb: 2 }}>
                <MapView pickup={pickupCoords} dropoff={dropoffCoords} routes={routes} selectedRouteIndex={selectedRouteIndex} onSpeakInstructions={speakInstructions} />
              </Box>
              {routes[selectedRouteIndex] && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Estimated fare: KES {fare}
                </Typography>
              )}
              <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleRequestRide}>
                Request Ride
              </Button>
            </>
          )}
        </Card>
      ) : (
        <Card sx={{ p: 3, backgroundColor: '#e8f5e8' }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'green' }}>
            Ride Requested Successfully!
          </Typography>
          <Typography>Ride ID: {ride._id}</Typography>
          <Typography>Fare: KES {ride.fare}</Typography>
          <Typography>Status: {ride.status}</Typography>

          {ride.status === 'accepted' && ride.driver && (
            <Box mt={2} sx={{ backgroundColor: '#fff3cd', p: 2, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ color: '#856404' }}>Driver Assigned!</Typography>
              <Typography>Name: {ride.driver.name}</Typography>
              <Typography>Email: {ride.driver.email}</Typography>
              <Typography>Car: {ride.driver.carMake} {ride.driver.carModel} ({ride.driver.carColor})</Typography>
              <Typography>Reg: {ride.driver.carRegNumber}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCompleteRide}>
                Complete Trip
              </Button>
            </Box>
          )}

          {ride.status === 'completed' && (
            <Box mt={2} sx={{ backgroundColor: '#d4edda', p: 2, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ color: '#155724' }}>Trip Completed!</Typography>
              <Typography>Thank you for using LiftMate. We hope you had a great ride!</Typography>
            </Box>
          )}

          {userLocation && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Your Live Location & Nearby Drivers</Typography>
              <MapView
                center={userLocation}
                markers={[
                  { position: userLocation, title: 'Your Location', icon: 'rider' },
                  ...(driverLocation ? [{ position: driverLocation, title: 'Your Driver', icon: 'driver' }] : []),
                  ...availableDrivers.map(driver => ({ position: [driver.location.coordinates[1], driver.location.coordinates[0]], title: driver.name, icon: 'driver' }))
                ]}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Nearby Drivers: {nearbyDrivers.length}
              </Typography>
              {driverLocation && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Driver is approaching...
                </Typography>
              )}
            </Box>
          )}

          <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handlePayment}>
            Pay via M-Pesa
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default RideRequest;
