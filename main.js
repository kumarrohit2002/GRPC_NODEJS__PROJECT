// main.js
import express from 'express';
import client from './client.js';

const app = express();
app.use(express.json());

// Route to fetch all users using gRPC
app.get('/', (req, res) => {
    client.getUser({}, (err, data) => {
        if (err) {
            console.error('Error in gRPC call:', err);
            res.status(500).send({ message: 'There was some issue in the gRPC call.' });
        } else {
            res.json({
                data,
                message:'Users get Successfully.', 
                success: true,
              });
        }
    });
});

// Route to add a user using gRPC
app.post('/add-user', (req, res) => {
    const newUser = req.body;
    client.addUser(newUser, (err, response) => {
        if (err) {
          console.error('Error in gRPC call:', err);
          res.status(500).json({ message: 'There was some issue in the gRPC call.' });
        } else {
          res.json({
            user:newUser,
            message:'User Added Successfully.', 
            success: true,
          });
        }
      });
});

// Start the Express server
const PORT = 5555;
app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`);
});
