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
            res.send(data);
        }
    });
});

// Route to add a user using gRPC
app.post('/add-user', (req, res) => {
    const newUser = req.body;
    client.addUser(newUser, (err, user) => {
        if (err) {
            console.error('Error in gRPC call:', err);
            res.status(500).send({ message: 'There was some issue in the gRPC call.' });
        } else {f
            res.send(user);
        }
    });
});

// Start the Express server
const PORT = 5555;
app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`);
});
