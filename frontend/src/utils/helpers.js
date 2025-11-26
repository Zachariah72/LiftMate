// Format a date to a readable string: "Nov 21, 2025, 3:15 PM"
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format a number as currency (default: Kenyan Shillings)
export const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Generate a simple unique ID (for rides or temp objects)
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

// Capitalize the first letter of a string
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Simple notification helper
export const notify = (message, type = 'info') => {
  alert(`[${type.toUpperCase()}] ${message}`);
};
import { formatDate, formatCurrency, generateId, capitalize, notify } from '../utils/helpers';

// In RideRequest or RideHistory:
console.log(formatDate('2025-11-21T12:00:00Z')); // "Nov 21, 2025, 3:00 PM"
console.log(formatCurrency(500)); // "KES 500"
console.log(generateId('ride')); // "ride_k3j9d2f8a"
console.log(capitalize('pickup')); // "Pickup"
notify('Ride requested successfully!', 'success');
