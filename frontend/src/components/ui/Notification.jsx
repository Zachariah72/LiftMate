import { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  Chip,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { notificationAnimations } from '../../utils/animations';

const Notification = ({
  open,
  onClose,
  message,
  title,
  severity = 'info',
  duration = 6000,
  position = 'bottom-right',
  showIcon = true,
  action,
  variant = 'filled',
  elevation = 6,
  sx = {}
}) => {
  const [slideDirection, setSlideDirection] = useState('up');

  useEffect(() => {
    // Set slide direction based on position
    if (position.includes('top')) {
      setSlideDirection('down');
    } else {
      setSlideDirection('up');
    }
  }, [position]);

  const getPosition = () => {
    switch (position) {
      case 'top-left':
        return { vertical: 'top', horizontal: 'left' };
      case 'top-center':
        return { vertical: 'top', horizontal: 'center' };
      case 'top-right':
        return { vertical: 'top', horizontal: 'right' };
      case 'bottom-left':
        return { vertical: 'bottom', horizontal: 'left' };
      case 'bottom-center':
        return { vertical: 'bottom', horizontal: 'center' };
      case 'bottom-right':
      default:
        return { vertical: 'bottom', horizontal: 'right' };
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    switch (severity) {
      case 'success':
        return <CheckCircleIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      case 'info':
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
      default:
        return '#2196f3';
    }
  };

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={duration}
      anchorOrigin={getPosition()}
      TransitionComponent={Slide}
      TransitionProps={{ direction: slideDirection }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        elevation={elevation}
        icon={getIcon()}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={onClose}
              sx={{ p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
        sx={{
          minWidth: 300,
          maxWidth: 500,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${getSeverityColor()}20`,
          ...sx,
        }}
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 'bold', mb: 1 }}>
            {title}
          </AlertTitle>
        )}
        <Typography variant="body2">
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

// Notification Manager Hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      open: true,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto close after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        closeNotification(id);
      }, notification.duration || 6000);
    }

    return id;
  };

  const closeNotification = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, open: false }
          : notification
      )
    );

    // Remove from state after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 300);
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, open: false })));
    setTimeout(() => {
      setNotifications([]);
    }, 300);
  };

  // Convenience methods
  const success = (message, options = {}) => addNotification({
    message,
    severity: 'success',
    ...options
  });

  const error = (message, options = {}) => addNotification({
    message,
    severity: 'error',
    ...options
  });

  const warning = (message, options = {}) => addNotification({
    message,
    severity: 'warning',
    ...options
  });

  const info = (message, options = {}) => addNotification({
    message,
    severity: 'info',
    ...options
  });

  return {
    notifications,
    addNotification,
    closeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};

// Notification Container Component
export const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          open={notification.open}
          onClose={() => onClose(notification.id)}
          {...notification}
        />
      ))}
    </>
  );
};

export default Notification;