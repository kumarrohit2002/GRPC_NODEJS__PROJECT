import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import mongoose from 'mongoose';
import User from './models/User.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PROTO_PATH = './proto/user.proto';
const MONGO_URI = process.env.MONGO_URI;
const GRPC_PORT = process.env.GRPC_PORT || '30043';

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {})
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

// Function to start gRPC server
export function startGrpcServer() {
  const server = new grpc.Server();

  // Define gRPC Methods
  server.addService(userProto.service, {
    getUser: async (_, callback) => {
      try {
        const users = await User.find();
        callback(null, { users });
      } catch (err) {
        callback({ code: grpc.status.INTERNAL, message: err.message }, null);
      }
    },
    addUser: async (call, callback) => {
      try {
        const user = new User(call.request);
        await user.save();
        callback(null, { message: 'User added successfully.' });
      } catch (err) {
        callback({ code: grpc.status.INTERNAL, message: err.message }, null);
      }
    },
  });

  // Start gRPC server
  server.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to start gRPC server:', err);
        return;
      }
      console.log(`gRPC server running on port ${port}`);
    }
  );
}
