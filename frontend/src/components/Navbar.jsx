import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { getDriverStats } from '../api/rides';
import SettingsDialog from './SettingsDialog';
import ProfileDialog from './ProfileDialog';
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
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  ClickAwayListener,
  Fade,
  keyframes
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ColorLensIcon from '@mui/icons-material/ColorLens';

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
  const { currentTheme, updateTheme, soundEnabled, toggleSound } = useCustomTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [driverStats, setDriverStats] = useState({ ordersReceived: { today: 0 }, earnings: 0 });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const isActive = (path) => location.pathname === path;

  // Fetch driver stats for profile dropdown
  useEffect(() => {
    if (user && user.role === 'driver') {
      const fetchStats = async () => {
        try {
          const res = await getDriverStats(user.token);
          setDriverStats(res.data);
        } catch (err) {
          console.error('Error fetching driver stats:', err);
        }
      };
      fetchStats();
    }
  }, [user]);

  // Handle theme changes
  const handleThemeChange = (newColor) => {
    updateTheme(newColor);
  };

  // Handle profile save
  const handleProfileSave = async (profileData) => {
    try {
      // In a real app, you would make an API call to update the profile
      // For now, we'll just update the local user state
      console.log('Saving profile:', profileData);
      // Update user context with new profile data
      // This would typically involve an API call and updating the auth context
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

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
        Ride
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
        Drive
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
        Business
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
        About
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
                boxShadow: '0 4px 12px rgba(35, 76, 106, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Request Ride
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
                boxShadow: '0 4px 12px rgba(35, 76, 106, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            My Rides
          </Button>
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              ml: 1,
              border: user?.isVerified ? '2px solid #4caf50' : '2px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: user?.isVerified ? '#4caf50' : '#667eea',
                border: user?.isVerified ? '2px solid #4caf50' : 'none'
              }}
              src={user?.profilePicture}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            {user?.isVerified && (
              <Box
                component="img"
                src="/images/verified.png"
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  padding: '1px'
                }}
              />
            )}
          </IconButton>
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
                boxShadow: '0 4px 12px rgba(35, 76, 106, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            EN
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
            Help
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
                color: '#234C6A',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(35, 76, 106, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Log in
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
            Sign up
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
        background: '#234C6A',
        boxShadow: '0 8px 32px rgba(35, 76, 106, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        animation: `${fadeIn} 0.8s ease-out`,
        position: 'relative'
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

      {/* Profile Dropdown Menu */}
      <Popper
        open={Boolean(profileAnchorEl)}
        anchorEl={profileAnchorEl}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <ClickAwayListener onClickAway={handleProfileMenuClose}>
            <Fade
              {...TransitionProps}
              timeout={350}
              style={{
                transformOrigin: placement === 'bottom-end' ? 'right top' : 'right bottom',
              }}
            >
              <Paper
                sx={{
                  minWidth: 300,
                  maxWidth: 400,
                  mt: 1,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                {/* User Info Header */}
                <Box sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: user?.isVerified ? '#4caf50' : '#667eea',
                        border: user?.isVerified ? '3px solid #4caf50' : 'none'
                      }}
                      src={user?.profilePicture}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    {user?.isVerified && (
                      <Box
                        component="img"
                        src="/images/verified.png"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 42,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          padding: '1px'
                        }}
                      />
                    )}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {user?.nickname || user?.name || 'User'}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Driver Status Section */}
                {user?.role === 'driver' && (
                  <>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                        🚗 Driver Status
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ color: '#ff9800', fontSize: 18 }} />
                          <Typography variant="body2">
                            Active Ride: None
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoneyIcon sx={{ color: '#4caf50', fontSize: 18 }} />
                          <Typography variant="body2">
                            Earnings Today: KES {driverStats.earnings || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

                <Divider />

                {/* Menu Items */}
                <MenuItem onClick={() => { setProfileOpen(true); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit Profile</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => { setSettingsOpen(true); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => { logout(); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onSave={handleProfileSave}
      />
    </AppBar>
  );
};

export default Navbar;
