require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary');

// Routes and middlewares
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const adminRoutes = require('./routes/admin');
const communityRoutes = require('./routes/community');
const { errorHandler } = require('./middlewares/errorHandler');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Initialize services
connectDB();

// Initialize express app (inlined from app.js)
const app = express();

const _dirname = path.resolve();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use(xss());
app.use(rateLimit({ windowMs: 60*1000, max: 100 }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => res.send('Waste Management API'));

// Error handler
app.use(errorHandler);

app.use(express.static(path.join(_dirname, "frontend/dist")));
app.get("/*splat", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

