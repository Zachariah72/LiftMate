import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Chip,
  keyframes
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  DriveEta as DriverIcon,
  PersonPin as RiderIcon,
  Wc as GenderIcon,
  DirectionsCar as CarIcon,
  ColorLens as ColorIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

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
    const res = await registerUser(data.name, data.email, data.password, data.role, data.gender, data.dateOfBirth, data.phoneNumber, data.carRegNumber, data.carMake, data.carModel, data.carColor);
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
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: `${fadeIn} 1s ease-in`,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <PersonIcon sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  color: '#062B32',
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                🚗 Join LiftMate
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Create your account and start your journey
              </Typography>
            </Box>

            {/* Role Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: '#062B32', fontWeight: 'bold' }}>
                Choose Your Role
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Chip
                  icon={<img src="/images/passenger.png" alt="passenger" style={{ width: 24, height: 24, borderRadius: '50%' }} />}
                  label="Rider"
                  onClick={() => setValue('role', 'rider')}
                  sx={{
                    px: 3,
                    py: 2,
                    fontSize: '1rem',
                    backgroundColor: watch('role') === 'rider' ? '#667eea' : '#f5f5f5',
                    color: watch('role') === 'rider' ? 'white' : '#666',
                    border: watch('role') === 'rider' ? '2px solid #667eea' : '2px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: watch('role') === 'rider' ? '#5a6fd8' : '#e8e8e8',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
                <Chip
                  icon={<img src="/images/8583437.png" alt="driver" style={{ width: 24, height: 24, borderRadius: '50%' }} />}
                  label="Driver"
                  onClick={() => setValue('role', 'driver')}
                  sx={{
                    px: 3,
                    py: 2,
                    fontSize: '1rem',
                    backgroundColor: watch('role') === 'driver' ? '#667eea' : '#f5f5f5',
                    color: watch('role') === 'driver' ? 'white' : '#666',
                    border: watch('role') === 'driver' ? '2px solid #667eea' : '2px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: watch('role') === 'driver' ? '#5a6fd8' : '#e8e8e8',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              </Box>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'grid', gap: 3 }}>
                {/* Basic Information */}
                <TextField
                  label="Full Name"
                  fullWidth
                  {...register('name')}
                  required
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  {...register('email')}
                  required
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />

                <TextField
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  {...register('phoneNumber')}
                  placeholder="+254 XXX XXX XXX"
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  {...register('password')}
                  required
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Gender</InputLabel>
                  <Select
                    {...register('gender')}
                    defaultValue="male"
                    startAdornment={<GenderIcon sx={{ color: '#667eea', mr: 1, ml: 1 }} />}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  >
                    <MenuItem value="male">👨 Male</MenuItem>
                    <MenuItem value="female">👩 Female</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  {...register('dateOfBirth')}
                  required
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />

                {/* Driver-specific fields */}
                {watch('role') === 'driver' && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 3,
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      borderRadius: 2,
                      border: '2px solid #667eea',
                      animation: `${slideIn} 0.5s ease-out`
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, color: '#062B32', textAlign: 'center' }}>
                      🚗 Vehicle Information
                    </Typography>

                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <TextField
                        label="Car Registration Number"
                        fullWidth
                        {...register('carRegNumber')}
                        required
                        InputProps={{
                          startAdornment: <CarIcon sx={{ color: '#667eea', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' }
                          }
                        }}
                      />

                      <TextField
                        label="Car Make"
                        fullWidth
                        {...register('carMake')}
                        required
                        InputProps={{
                          startAdornment: <CarIcon sx={{ color: '#667eea', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' }
                          }
                        }}
                      />

                      <TextField
                        label="Car Model"
                        fullWidth
                        {...register('carModel')}
                        required
                        InputProps={{
                          startAdornment: <CarIcon sx={{ color: '#667eea', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' }
                          }
                        }}
                      />

                      <TextField
                        label="Car Color"
                        fullWidth
                        {...register('carColor')}
                        required
                        InputProps={{
                          startAdornment: <ColorIcon sx={{ color: '#667eea', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' }
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  disabled={loading}
                >
                  {loading ? '🚀 Creating Account...' : '🎯 Create Account'}
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign In Here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;
