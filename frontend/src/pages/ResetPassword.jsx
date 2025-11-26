import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { resetPassword } from '../api/auth';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const ResetPassword = () => {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      const res = await resetPassword(data.token, data.newPassword);
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
          Reset Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          Enter the reset token and your new password.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Reset Token"
            fullWidth
            margin="normal"
            {...register('token')}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('newPassword')}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#062B32', '&:hover': { backgroundColor: '#054a4f' } }}
          >
            Reset Password
          </Button>
        </form>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
};

export default ResetPassword;