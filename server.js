require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./DataBase/db.js');
const authRoutes = require('./Routes/auth-routes.js');
const homeRoutes = require('./Home/home-routes.js');
const adminRoutes = require('./Routes/admin-route.js');
const uploadImageRoutes = require('./Routes/image-routes.js');

const app = express();

// Connect to Database
connectToDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Invalid or missing token' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
