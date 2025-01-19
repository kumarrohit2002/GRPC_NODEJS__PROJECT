// server.js
const PROTO_PATH = './proto/user.proto';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;
const server = new grpc.Server();

const users = [{ name: 'Rohit Kumar', email: 'rohit@gmail.com', age: 12 },];


server.addService(userProto.service, {
    getUser: (_, callback) => {
        console.log('getUser called');
        callback(null, { users });
    },
    addUser: (call, callback) => {
        console.log('addUser called with:', call.request);
        const user = call.request;
        users.push(user);
        callback(null, user);
    },
});


const PORT = 30043;

server.bindAsync(
    '127.0.0.1:30043',
    grpc.ServerCredentials.createInsecure(),
    (err) => {
        if (err) {
            console.error('Server error:', err);
            return;
        }
        console.log(`gRPC server is running on 127.0.0.1:${PORT}`);
    }
);
