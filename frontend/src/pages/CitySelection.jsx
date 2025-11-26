import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Accordion, AccordionSummary, AccordionDetails, Button, Grid, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const cities = [
  {
    name: 'Nairobi',
    country: 'Kenya',
    streets: ['Koinange Street', 'Luthuli Avenue', 'Tom Mboya Street', 'River Road'],
    pickupPoints: ['Westlands', 'Karen', 'Kilimani', 'Langata'],
    dropPoints: ['CBD', 'Parklands', 'Hurligham', 'Mombasa Road']
  },
  {
    name: 'Dar es Salaam',
    country: 'Tanzania',
    streets: ['Samora Avenue', 'Uhuru Road', 'Independence Avenue'],
    pickupPoints: ['Masaki', 'Mikocheni', 'Msasani'],
    dropPoints: ['CBD', 'Kivukoni', 'Temeke']
  },
  {
    name: 'Addis Ababa',
    country: 'Ethiopia',
    streets: ['Bole Road', 'Africa Avenue', 'King George VI Street'],
    pickupPoints: ['Bole', 'Kazanchis', 'Piassa'],
    dropPoints: ['Merkato', 'Entoto Hill', 'Shiromeda']
  },
  {
    name: 'Johannesburg',
    country: 'South Africa',
    streets: ['Sandton Drive', 'Oxford Road', 'Rivonia Road'],
    pickupPoints: ['Sandton', 'Rosebank', 'Hyde Park'],
    dropPoints: ['CBD', 'Braamfontein', 'Soweto']
  },
  {
    name: 'London',
    country: 'United Kingdom',
    streets: ['Oxford Street', 'Baker Street', 'Regent Street'],
    pickupPoints: ['Heathrow', 'Gatwick', 'Stansted'],
    dropPoints: ['Central London', 'West End', 'East London']
  },
  {
    name: 'New York',
    country: 'USA',
    streets: ['Broadway', '5th Avenue', 'Wall Street'],
    pickupPoints: ['Manhattan', 'Brooklyn', 'Queens'],
    dropPoints: ['Times Square', 'Central Park', 'Staten Island']
  },
  // Add more cities
];

const CitySelection = () => {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(search.toLowerCase()) ||
    city.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectLocation = (city, type, location) => {
    setSelectedLocation({ city, type, location });
  };

  const handleBookRide = () => {
    if (selectedLocation) {
      const fullLocation = `${selectedLocation.location}, ${selectedLocation.city.name}`;
      navigate('/ride-request', { state: { location: fullLocation } });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" className="bungee-spice-regular" gutterBottom sx={{ textAlign: 'center', color: '#062B32' }}>
        Select City & Location
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 4 }}>
        Choose a city and specific pickup or drop point
      </Typography>

      <TextField
        label="Search Cities"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {filteredCities.map((city) => (
        <Accordion key={city.name} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{city.name}, {city.country}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Streets</Typography>
                {city.streets.map((street) => (
                  <Card
                    key={street}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      border: selectedLocation?.location === street && selectedLocation?.city.name === city.name ? '2px solid #062B32' : '1px solid #ddd'
                    }}
                    onClick={() => handleSelectLocation(city, 'street', street)}
                  >
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2">{street}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Pickup Points</Typography>
                {city.pickupPoints.map((point) => (
                  <Card
                    key={point}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      border: selectedLocation?.location === point && selectedLocation?.city.name === city.name ? '2px solid #062B32' : '1px solid #ddd'
                    }}
                    onClick={() => handleSelectLocation(city, 'pickup', point)}
                  >
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2">{point}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Drop Points</Typography>
                {city.dropPoints.map((point) => (
                  <Card
                    key={point}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      border: selectedLocation?.location === point && selectedLocation?.city.name === city.name ? '2px solid #062B32' : '1px solid #ddd'
                    }}
                    onClick={() => handleSelectLocation(city, 'drop', point)}
                  >
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2">{point}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {selectedLocation && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selected: {selectedLocation.location}, {selectedLocation.city.name}
          </Typography>
          <Button variant="contained" size="large" onClick={handleBookRide} sx={{ backgroundColor: '#062B32' }}>
            Book Ride to/from this Location
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CitySelection;