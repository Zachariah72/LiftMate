// src/pages/Login.jsx
import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await login(data.email, data.password);
    setLoading(false);

    if (res.success) {
      if (res.role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        navigate('/ride-request');
      }
    } else {
      alert(res.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} sx={{ textAlign: 'center', backgroundColor: '#f9f9f9', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" className="bungee-spice-regular" gutterBottom sx={{ color: '#062B32' }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register('email')}
            required
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: 'email' }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            required
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: 'current-password' }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, mb: 2, backgroundColor: '#062B32', '&:hover': { backgroundColor: '#054a4f' } }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Box mt={2}>
          <Typography sx={{ mb: 1 }}>
            <Link to="/forgot-password" style={{ color: '#062B32', textDecoration: 'none' }}>Forgot Password?</Link>
          </Typography>
          <Typography>
            Don't have an account? <Link to="/register" style={{ color: '#062B32', textDecoration: 'none' }}>Register here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
