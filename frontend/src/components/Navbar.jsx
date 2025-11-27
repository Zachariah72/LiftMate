import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  keyframes
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => location.pathname === path;

  const handleRideClick = () => {
    if (user) {
      navigate('/ride-request');
    } else {
      navigate('/register?role=rider');
    }
  };

  const handleDriveClick = () => {
    if (user) {
      if (user.role === 'driver') {
        navigate('/driver-dashboard');
      } else {
        alert('Only drivers can access this.');
      }
    } else {
      navigate('/register?role=driver');
    }
  };

  const renderDesktopMenu = () => (
    <>
      <Button
        sx={{
          color: 'white',
          mx: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '1rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
          },
          transition: 'all 0.3s ease'
        }}
        onClick={handleRideClick}
      >
        🚗 Ride
      </Button>
      <Button
        sx={{
          color: 'white',
          mx: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '1rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
          },
          transition: 'all 0.3s ease'
        }}
        onClick={handleDriveClick}
      >
        🚙 Drive
      </Button>
      <Button
        sx={{
          color: 'white',
          mx: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '1rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        💼 Business
      </Button>
      <Button
        component={Link}
        to="/about"
        sx={{
          color: 'white',
          mx: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: '1rem',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        ℹ️ About
      </Button>

      <Box sx={{ flexGrow: 1 }} />

      {user ? (
        <>
          <Button
            component={Link}
            to="/ride-request"
            sx={{
              color: isActive('/ride-request') ? '#ffd700' : 'white',
              mx: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              backgroundColor: isActive('/ride-request') ? 'rgba(255,215,0,0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            📝 Request Ride
          </Button>
          <Button
            component={Link}
            to="/ride-history"
            sx={{
              color: isActive('/ride-history') ? '#ffd700' : 'white',
              mx: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              backgroundColor: isActive('/ride-history') ? 'rgba(255,215,0,0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            📋 My Rides
          </Button>
          <Button
            onClick={logout}
            sx={{
              color: 'white',
              mx: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            🚪 Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            sx={{
              color: 'white',
              mx: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            🌐 EN
          </Button>
          <Button
            sx={{
              color: 'white',
              mx: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            ❓ Help
          </Button>
          <Button
            component={Link}
            to="/login"
            sx={{
              color: 'white',
              mx: 1,
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              border: '2px solid white',
              '&:hover': {
                backgroundColor: 'white',
                color: '#667eea',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255,255,255,0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            🔐 Log in
          </Button>
          <Button
            component={Link}
            to="/register"
            sx={{
              mx: 1,
              px: 3,
              py: 1,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)',
              color: '#1e0a78',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.6)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            ✨ Sign up
          </Button>
        </>
      )}
    </>
  );

  const renderMobileMenu = () => (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {user ? (
          user.role === 'rider' ? [
            <MenuItem key="ride-request" onClick={handleMenuClose} component={Link} to="/ride-request">Request Ride</MenuItem>,
            <MenuItem key="ride-history" onClick={handleMenuClose} component={Link} to="/ride-history">My Rides</MenuItem>,
            <MenuItem key="logout" onClick={() => { logout(); handleMenuClose(); }}>Logout</MenuItem>
          ] : [
            <MenuItem key="dashboard" onClick={handleMenuClose} component={Link} to="/driver-dashboard">Dashboard</MenuItem>,
            <MenuItem key="logout" onClick={() => { logout(); handleMenuClose(); }}>Logout</MenuItem>
          ]
        ) : (
          [
            <MenuItem key="ride" onClick={() => { handleRideClick(); handleMenuClose(); }}>Ride</MenuItem>,
            <MenuItem key="drive" onClick={() => { handleDriveClick(); handleMenuClose(); }}>Drive</MenuItem>,
            <MenuItem key="business" onClick={handleMenuClose}>Business</MenuItem>,
            <MenuItem key="about" onClick={handleMenuClose} component={Link} to="/about">About</MenuItem>,
            <MenuItem key="en" onClick={handleMenuClose}>EN</MenuItem>,
            <MenuItem key="help" onClick={handleMenuClose}>Help</MenuItem>,
            <MenuItem key="login" onClick={handleMenuClose} component={Link} to="/login">Log in</MenuItem>,
            <MenuItem key="signup" onClick={handleMenuClose} component={Link} to="/register">Sign up</MenuItem>
          ]
        )}
      </Menu>
    </>
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        animation: `${fadeIn} 0.8s ease-out`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          zIndex: -1
        }
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography
          variant="h6"
          sx={{
            cursor: 'pointer',
            fontSize: { xs: '1.3rem', md: '1.8rem' },
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            mr: 4
          }}
          component={Link}
          to="/"
        >
          <Box component="span" sx={{ color: '#ffd700', mr: 0.5 }}>Lift</Box>
          <Box component="span" sx={{ color: '#667eea' }}>Mate</Box>
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? renderMobileMenu() : renderDesktopMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
