import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GRPC_HOST = process.env.GRPC_HOST || "localhost:50051";

const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../proto/user.proto"), {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition);
const userService = proto.user.UserService;

function getClient() {
  return new userService(GRPC_HOST, grpc.credentials.createInsecure());
}

// export async function getUserById(userId) {
//   const client = getClient();
  
//   return new Promise((resolve, reject) => {
//     client.getUserById({ userId }, (err, response) => {
//       if (err) {
//         if (err.code === grpc.status.NOT_FOUND) {
//           resolve(null);
//           return;
//         }
//         reject(err);
//         return;
//       }
//       resolve(response);
//     });
//   });
// }

export async function clearUserCache(userId) {
  const client = getClient();
  
  return new Promise((resolve, reject) => {
    client.clearUserCache({ userId }, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

export async function verifyToken(token) {
  const client = getClient();
  
  return new Promise((resolve, reject) => {
    client.verifyToken({ token }, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}
