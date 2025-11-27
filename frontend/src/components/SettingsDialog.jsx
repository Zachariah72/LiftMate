import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const colorOptions = [
  { name: 'Blue', value: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Green', value: '#4CAF50', gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' },
  { name: 'Purple', value: '#9C27B0', gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' },
  { name: 'Orange', value: '#FF9800', gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' },
  { name: 'Red', value: '#F44336', gradient: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)' },
  { name: 'Teal', value: '#009688', gradient: 'linear-gradient(135deg, #009688 0%, #00796B 100%)' },
  { name: 'Indigo', value: '#3F51B5', gradient: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 100%)' },
  { name: 'Pink', value: '#E91E63', gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)' }
];

const SettingsDialog = ({ open, onClose, currentTheme, onThemeChange }) => {
  const [selectedColor, setSelectedColor] = useState(currentTheme || '#667eea');
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSave = () => {
    onThemeChange(selectedColor);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={false}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
          m: { xs: 0, sm: 2 }
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
          <ColorLensIcon sx={{ color: selectedColor }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Settings
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Theme Color Picker */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            🎨 Theme Color
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Choose your preferred theme color for the application
          </Typography>

          <Grid container spacing={2}>
            {colorOptions.map((color) => (
              <Grid item xs={6} sm={4} md={3} key={color.value}>
                <Paper
                  onClick={() => handleColorSelect(color.value)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderRadius: 2,
                    border: selectedColor === color.value ? '3px solid #333' : '2px solid transparent',
                    background: color.gradient,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 80
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      textAlign: 'center'
                    }}
                  >
                    {color.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Preferences */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            ⚙️ Preferences
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  color="primary"
                />
              }
              label="Push Notifications"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '1rem' } }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  color="primary"
                />
              }
              label="Sound Effects"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '1rem' } }}
            />
          </Box>
        </Box>

        {/* Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            👁️ Preview
          </Typography>
          <Paper
            sx={{
              p: 2,
              background: `linear-gradient(135deg, ${selectedColor} 0%, ${colorOptions.find(c => c.value === selectedColor)?.value || '#764ba2'} 100%)`,
              borderRadius: 2,
              color: 'white'
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              LiftMate
            </Typography>
            <Typography variant="body2">
              Theme preview with selected color
            </Typography>
          </Paper>
        </Box>
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
          sx={{
            borderRadius: 2,
            background: `linear-gradient(135deg, ${selectedColor} 0%, ${colorOptions.find(c => c.value === selectedColor)?.value || '#764ba2'} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${selectedColor}CC 0%, ${colorOptions.find(c => c.value === selectedColor)?.value || '#764ba2'}CC 100%)`
            }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;