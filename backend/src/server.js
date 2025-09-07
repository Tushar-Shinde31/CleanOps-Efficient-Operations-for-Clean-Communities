require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary');

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

