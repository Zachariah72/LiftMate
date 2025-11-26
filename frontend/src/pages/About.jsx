import { Container, Typography, Box, Grid, Card, CardContent, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" className="bungee-spice-regular" gutterBottom sx={{ color: '#062B32' }}>
          About LiftMate
        </Typography>
        <Typography variant="h5" sx={{ color: '#666', maxWidth: '800px', mx: 'auto' }}>
          Revolutionizing ride-sharing with smart technology, connecting passengers and drivers seamlessly.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ color: '#062B32' }}>
                Our Mission
              </Typography>
              <Typography variant="body1">
                LiftMate is dedicated to providing safe, efficient, and affordable transportation solutions.
                We connect riders with drivers through an intuitive platform that prioritizes user experience
                and community safety.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ color: '#062B32' }}>
                Our Vision
              </Typography>
              <Typography variant="body1">
                To become the leading ride-sharing platform globally, fostering sustainable transportation
                and building communities where everyone can move freely and safely.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#062B32', textAlign: 'center' }}>
              Why Choose LiftMate?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Safety First</Typography>
                <Typography>Ride with confidence using our verified driver network and real-time tracking.</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Affordable Rates</Typography>
                <Typography>Competitive pricing with transparent fare calculations and no hidden fees.</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>24/7 Support</Typography>
                <Typography>Our customer service team is always ready to assist you with any questions.</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;