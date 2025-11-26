import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Button, Typography, Box, useTheme, useMediaQuery, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

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
      <Button color="inherit" sx={{ color: 'white' }} onClick={handleRideClick}>Ride</Button>
      <Button color="inherit" sx={{ color: 'white' }} onClick={handleDriveClick}>Drive</Button>
      <Button color="inherit" sx={{ color: 'white' }}>Business</Button>
      <Button component={Link} to="/about" sx={{ color: 'white' }}>About</Button>
      <Box sx={{ flexGrow: 1 }} />
      {user ? (
        <>
          <Button component={Link} to="/ride-request" sx={{ color: isActive('/ride-request') ? '#bbdefb' : 'white', mx: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>Request Ride</Button>
          <Button component={Link} to="/ride-history" sx={{ color: isActive('/ride-history') ? '#bbdefb' : 'white', mx: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>My Rides</Button>
          <Button onClick={logout} sx={{ color: 'white', mx: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>Logout</Button>
        </>
      ) : (
        <>
          <Button color="inherit" sx={{ color: 'white' }}>EN</Button>
          <Button color="inherit" sx={{ color: 'white' }}>Help</Button>
          <Button component={Link} to="/login" sx={{ color: 'white', mx: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>Log in</Button>
          <Button component={Link} to="/register" sx={{ color: 'white', mx: 1, backgroundColor: 'white', color: 'black', borderRadius: '20px', padding: '5px 15px', '&:hover': { backgroundColor: '#f0f0f0' } }}>Sign up</Button>
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
      className="navbar"
      sx={{
        backgroundColor: '#062B32',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          className="bungee-spice-regular"
          sx={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          }}
          component={Link}
          to="/"
        >
          <img src="/images/image-removebg-preview (2).png" alt="Liftmate Logo" style={{ height: '40px', marginRight: '10px' }} />
        </Typography>
        {isMobile ? renderMobileMenu() : renderDesktopMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
