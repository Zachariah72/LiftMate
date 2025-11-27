// Database connection test endpoint
router.get('/db-test', async (req, res) => {
  try {
    // Test MongoDB connection
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'Database Test',
      dbConnection: dbStates[dbStatus],
      readyState: dbStatus,
      dbName: mongoose.connection.name || 'Not connected',
      host: mongoose.connection.host || 'Not connected',
      port: mongoose.connection.port || 'Not connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'Database Error',
      error: error.message,
      stack: error.stack
    });
  }
});

// Environment variables test endpoint  
router.get('/env-test', (req, res) => {
  res.json({
    status: 'Environment Test',
    nodeEnv: process.env.NODE_ENV || 'Not set',
    mongoUri: process.env.MONGO_URI ? 'Set (hidden)' : 'Not set',
    jwtSecret: process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set',
    frontendUrl: process.env.FRONTEND_URL || 'Not set',
    port: process.env.PORT || 'Not set (using default)'
  });
});