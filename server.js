import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import mongoose from 'mongoose';
import User from './models/User.model.js';

const PROTO_PATH = './proto/user.proto';
const MONGO_URI = 'mongodb://localhost:27017/grpc_demo';
const PORT = 30043;

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Load gRPC Service Definitions
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const server = new grpc.Server();

// Define gRPC Methods
server.addService(userProto.service, {
  getUser: async (_, callback) => {
    try {
      const users = await User.find(); // Fetch all users from MongoDB
      callback(null, { users });
    } catch (err) {
      callback(err, null);
    }
  },
  addUser: async (call, callback) => {
    try {
      const user = new User(call.request); // Create and save the user
      await user.save();
      callback(null, { user, message: 'Added user successfully' });
    } catch (err) {
      callback(err, null);
    }
  },
});

// Start gRPC Server
server.bindAsync(
  `127.0.0.1:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err) => {
    if (err) {
      console.error('Server error:', err);
      return;
    }
    console.log(`gRPC server is running on 127.0.0.1:${PORT}`);
  }
);
