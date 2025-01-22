import express from 'express';
import client from './client.js';
import dotenv from 'dotenv';
import { startGrpcServer } from './server.js';


dotenv.config();

const app = express();
app.use(express.json());

// Fetch all users using gRPC
app.get('/', (req, res) => {
  client.getUser({}, (err, data) => {
    if (err) {
      console.error('gRPC Error:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    } else {
      res.json({ success: true, message: 'Users fetched successfully.', data });
    }
  });
});

// Add a user using gRPC
app.post('/add-user', (req, res) => {
  const newUser = req.body;
  client.addUser(newUser, (err, response) => {
    if (err) {
      console.error('gRPC Error:', err);
      res.status(500).json({ success: false, message: 'Failed to add user.' });
    } else {
      res.json({ success: true, message: 'User added successfully.', response });
    }
  });
});

// Start the Express server
const PORT = process.env.EXPRESS_PORT || 5555;
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});

startGrpcServer();