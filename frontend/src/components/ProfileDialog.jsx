import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';

const ProfileDialog = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
    profilePicture: user?.profilePicture || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // In a real app, you would upload the image to a server
      // For now, we'll just use the preview URL
      const updatedData = {
        ...formData,
        profilePicture: previewUrl
      };

      await onSave(updatedData);
      onClose();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon sx={{ color: '#667eea' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Edit Profile
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Profile Picture Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            📸 Profile Picture
          </Typography>

          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={previewUrl}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                border: user?.isVerified ? '4px solid #4caf50' : '4px solid #667eea',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
            >
              <PersonIcon sx={{ fontSize: 60, color: '#667eea' }} />
            </Avatar>

            {user?.isVerified && (
              <Box
                component="img"
                src="/images/verified.png"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 8,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  padding: '2px'
                }}
              />
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: '#667eea',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#5a6fd8',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
            Click the camera icon to change your profile picture
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Profile Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
            👤 Profile Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Display Name/Nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                placeholder="Enter your preferred display name"
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
            </Grid>

            {/* Read-only fields */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#495057' }}>
                  Account Information
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ color: '#667eea', mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon sx={{ color: '#667eea', mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formatDate(user?.dateOfBirth)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ color: '#667eea', mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Account Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {user?.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* KYC Verification Section */}
        {user?.role === 'driver' && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                🛡️ KYC Verification
              </Typography>

              <Paper sx={{
                p: 3,
                backgroundColor: user?.isVerified ? '#e8f5e8' : '#fff3cd',
                border: `2px solid ${user?.isVerified ? '#4caf50' : '#ffc107'}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {user?.isVerified ? (
                    <>
                      <VerifiedUserIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                          Account Verified ✅
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                          Your account has been successfully verified. You can now accept rides.
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <PersonIcon sx={{ color: '#f57c00', fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: '#e65100', fontWeight: 'bold' }}>
                          Verification Required
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#e65100' }}>
                          Upload your ID document and driver's license to get verified.
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            mt: 1,
                            backgroundColor: '#f57c00',
                            '&:hover': { backgroundColor: '#ef6c00' }
                          }}
                        >
                          Upload Documents
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Paper>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ mr: 1, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;