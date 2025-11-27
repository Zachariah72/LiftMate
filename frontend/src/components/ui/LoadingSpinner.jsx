import { Box, CircularProgress, Typography } from '@mui/material';
import { gradientShift } from '../../utils/animations';

const LoadingSpinner = ({
  size = 40,
  thickness = 4,
  color = 'primary',
  message = 'Loading...',
  showMessage = true,
  fullScreen = false,
  overlay = false,
  sx = {}
}) => {
  const spinner = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullScreen ? '100vh' : 'auto',
        ...sx,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={size}
          thickness={thickness}
          color={color}
          sx={{
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {/* Animated gradient ring */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.3), transparent)`,
            animation: `${gradientShift} 2s linear infinite`,
            zIndex: -1,
          }}
        />
      </Box>
      {showMessage && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (overlay) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {spinner}
      </Box>
    );
  }

  return spinner;
};

export default LoadingSpinner;