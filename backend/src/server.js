require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary');

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// (Optional) attach socket.io for real-time
// const io = require('socket.io')(server, { cors: { origin: "*" }});
// io.on('connection', (socket) => {
//   console.log('Socket connected', socket.id);
//   socket.on('join', (room) => socket.join(room));
// });
