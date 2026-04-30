const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running successfully!' });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling
server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});

// Keep process alive
setInterval(() => {
  // Keeping event loop active
}, 60000);
