import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, List, ListItem, ListItemButton, ListItemText, Button, Grid, Card, CardContent } from '@mui/material';

const airports = [
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya' },
  { code: 'DAR', name: 'Julius Nyerere International Airport', city: 'Dar es Salaam', country: 'Tanzania' },
  { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia' },
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  // Add more airports as needed
];

const AirportSelection = () => {
  const [search, setSearch] = useState('');
  const [selectedAirport, setSelectedAirport] = useState(null);
  const navigate = useNavigate();

  const filteredAirports = airports.filter(airport =>
    airport.name.toLowerCase().includes(search.toLowerCase()) ||
    airport.city.toLowerCase().includes(search.toLowerCase()) ||
    airport.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAirport = (airport) => {
    setSelectedAirport(airport);
  };

  const handleBookRide = () => {
    if (selectedAirport) {
      // Navigate to ride request with airport as pickup or destination
      navigate('/ride-request', { state: { location: `${selectedAirport.name}, ${selectedAirport.city}` } });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" className="bungee-spice-regular" gutterBottom sx={{ textAlign: 'center', color: '#062B32' }}>
        Select Airport
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 4 }}>
        Choose an airport for your pickup or destination
      </Typography>

      <TextField
        label="Search Airports"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={2}>
        {filteredAirports.map((airport) => (
          <Grid item xs={12} md={6} lg={4} key={airport.code}>
            <Card
              sx={{
                cursor: 'pointer',
                border: selectedAirport?.code === airport.code ? '2px solid #062B32' : '1px solid #ddd',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleSelectAirport(airport)}
            >
              <CardContent>
                <Typography variant="h6">{airport.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {airport.city}, {airport.country}
                </Typography>
                <Typography variant="body2" color="primary">
                  Code: {airport.code}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedAirport && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selected: {selectedAirport.name}
          </Typography>
          <Button variant="contained" size="large" onClick={handleBookRide} sx={{ backgroundColor: '#062B32' }}>
            Book Ride to/from this Airport
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default AirportSelection;