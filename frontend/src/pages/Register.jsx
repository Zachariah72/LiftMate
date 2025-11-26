import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Register = () => {
  const { register: registerUser } = useContext(AuthContext);
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = searchParams.get('role') || 'rider';
    setValue('role', role);
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await registerUser(data.name, data.email, data.password, data.role, data.gender, data.carRegNumber, data.carMake, data.carModel, data.carColor);
    setLoading(false);

    if (res.success) {
      if (data.role === 'driver') {
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
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register('name')}
            required
            sx={{ mb: 2 }}
            inputProps={{ autoComplete: 'name' }}
          />
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
            inputProps={{ autoComplete: 'new-password' }}
          />
          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select {...register('role')} defaultValue="rider">
              <MenuItem value="rider">Rider</MenuItem>
              <MenuItem value="driver">Driver</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select {...register('gender')} defaultValue="male">
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>

          {watch('role') === 'driver' && (
            <>
              <TextField
                label="Car Registration Number"
                fullWidth
                margin="normal"
                {...register('carRegNumber')}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Car Make"
                fullWidth
                margin="normal"
                {...register('carMake')}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Car Model"
                fullWidth
                margin="normal"
                {...register('carModel')}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Car Color"
                fullWidth
                margin="normal"
                {...register('carColor')}
                required
                sx={{ mb: 2 }}
              />
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, mb: 2, backgroundColor: '#062B32', '&:hover': { backgroundColor: '#054a4f' } }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Box mt={2}>
          <Typography>
            Already have an account? <Link to="/login" style={{ color: '#062B32', textDecoration: 'none' }}>Login here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
