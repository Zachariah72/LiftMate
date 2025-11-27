import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Grid,
  Chip,
  Alert,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

const DOCUMENT_TYPES = {
  idDocument: {
    label: 'National ID / Passport',
    icon: PersonIcon,
    description: 'Upload a clear photo of your national ID or passport'
  },
  passport: {
    label: 'Passport (Alternative)',
    icon: CreditCardIcon,
    description: 'Upload your passport if you don\'t have a national ID'
  },
  driversLicense: {
    label: 'Driver\'s License',
    icon: DriveEtaIcon,
    description: 'Upload your valid driver\'s license'
  }
};

const KycVerificationDialog = ({ open, onClose, user, onSubmit }) => {
  const [documents, setDocuments] = useState({
    idDocument: null,
    passport: null,
    driversLicense: null
  });
  const [previews, setPreviews] = useState({
    idDocument: null,
    passport: null,
    driversLicense: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fileInputsRef = {
    idDocument: useRef(null),
    passport: useRef(null),
    driversLicense: useRef(null)
  };

  const handleFileSelect = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [documentType]: e.target.result
        }));
      };
      reader.readAsDataURL(file);

      setError('');
    }
  };

  const handleRemoveFile = (documentType) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
    setPreviews(prev => ({
      ...prev,
      [documentType]: null
    }));
  };

  const handleSubmit = async () => {
    // Check if at least ID document and driver's license are uploaded
    if (!documents.idDocument && !documents.passport) {
      setError('Please upload either National ID or Passport');
      return;
    }

    if (!documents.driversLicense) {
      setError('Please upload your Driver\'s License');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Prepare form data
      const formData = new FormData();
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      // Submit documents
      await onSubmit(formData);

      setUploadProgress(100);
      setSuccess(true);

      // Close dialog after success
      setTimeout(() => {
        onClose();
        // Reset state
        setDocuments({
          idDocument: null,
          passport: null,
          driversLicense: null
        });
        setPreviews({
          idDocument: null,
          passport: null,
          driversLicense: null
        });
        setSuccess(false);
        setUploadProgress(0);
      }, 2000);

    } catch (err) {
      setError('Failed to upload documents. Please try again.');
      console.error('KYC upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const renderDocumentUpload = (documentType) => {
    const docConfig = DOCUMENT_TYPES[documentType];
    const IconComponent = docConfig.icon;
    const hasFile = documents[documentType];
    const preview = previews[documentType];

    return (
      <Grid item xs={12} md={4} key={documentType}>
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            border: hasFile ? '2px solid #4caf50' : '2px dashed #ddd',
            backgroundColor: hasFile ? '#f1f8e9' : '#fafafa',
            cursor: hasFile ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: hasFile ? '#4caf50' : '#667eea',
              backgroundColor: hasFile ? '#f1f8e9' : '#f5f5f5'
            }
          }}
          onClick={() => !hasFile && fileInputsRef[documentType].current?.click()}
        >
          <input
            type="file"
            ref={fileInputsRef[documentType]}
            onChange={(e) => handleFileSelect(documentType, e)}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {hasFile ? (
            <Box>
              <Box
                component="img"
                src={preview}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  objectFit: 'cover',
                  mb: 2,
                  border: '2px solid #4caf50'
                }}
              />
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                {docConfig.label}
              </Typography>
              <Typography variant="body2" sx={{ color: '#2e7d32', mb: 1 }}>
                Uploaded successfully
              </Typography>
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(documentType);
                }}
                sx={{ color: '#f44336' }}
              >
                Remove
              </Button>
            </Box>
          ) : (
            <Box>
              <IconComponent sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>
                {docConfig.label}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {docConfig.description}
              </Typography>
              <CloudUploadIcon sx={{ fontSize: 32, color: '#667eea' }} />
              <Typography variant="body2" sx={{ color: '#667eea', mt: 1, fontWeight: 'bold' }}>
                Click to upload
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={!uploading ? onClose : undefined}
      maxWidth="md"
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
          <PersonIcon sx={{ color: '#667eea' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            KYC Verification
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={uploading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <ErrorIcon sx={{ mr: 1 }} />
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <CheckCircleIcon sx={{ mr: 1 }} />
            Documents uploaded successfully! Your account will be verified within 24 hours.
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          To get verified and start accepting rides, please upload clear photos of your identification documents.
          All documents are kept secure and confidential.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            📋 Required Documents
          </Typography>

          <Grid container spacing={3}>
            {renderDocumentUpload('idDocument')}
            {renderDocumentUpload('passport')}
            {renderDocumentUpload('driversLicense')}
          </Grid>
        </Box>

        {uploading && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Uploading documents... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Verification Process:</strong> Documents will be reviewed within 24 hours.
            You'll receive an email notification once your account is verified.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<CheckCircleIcon />}
            label="Secure Upload"
            size="small"
            sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
          />
          <Chip
            icon={<CheckCircleIcon />}
            label="Encrypted Storage"
            size="small"
            sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
          />
          <Chip
            icon={<CheckCircleIcon />}
            label="24hr Review"
            size="small"
            sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={uploading}
          sx={{ mr: 1, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || success}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          {uploading ? 'Uploading...' : success ? 'Success!' : 'Submit for Verification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KycVerificationDialog;