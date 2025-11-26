import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { forgotPassword } from '../api/auth';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      const res = await forgotPassword(data.email);
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} sx={{ textAlign: 'center', backgroundColor: '#f9f9f9', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" className="bungee-spice-regular" gutterBottom sx={{ color: '#062B32' }}>
          Forgot Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          Enter your email to receive a reset token.
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
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#062B32', '&:hover': { backgroundColor: '#054a4f' } }}
          >
            Send Reset Token
          </Button>
        </form>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
};

export default ForgotPassword;