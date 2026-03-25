import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { findUserById, clearUserCache, verifyAndGetUser } from "./services/authService.js";

const GRPC_PORT = process.env.GRPC_PORT || 50051;

const packageDefinition = protoLoader.loadSync("./proto/user.proto", {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition);
const userService = proto.user;

export async function startGrpcServer() {
  const server = new grpc.Server();

  server.addService(userService.UserService.service, {
    // getUserById: async (call, callback) => {
    //   try {
    //     const userId = call.request.userId;
    //     const user = await findUserById(userId);
        
    //     if (!user) {
    //       return callback({ code: grpc.status.NOT_FOUND, message: "User not found" });
    //     }

    //     callback(null, {
    //       id: user.id,
    //       username: user.username,
    //       email: user.email,
    //       passwordHash: user.password_hash,
    //       role: user.role,
    //       avatar: user.avatar || "",
    //       createdAt: user.created_at?.toISOString() || "",
    //       updatedAt: user.updated_at?.toISOString() || ""
    //     });
    //   } catch (error) {
    //     callback({ code: grpc.status.INTERNAL, message: error.message });
    //   }
    // },

    clearUserCache: async (call, callback) => {
      try {
        const userId = call.request.userId;
        await clearUserCache(userId);
        callback(null, { success: true });
      } catch (error) {
        callback({ code: grpc.status.INTERNAL, message: error.message });
      }
    },

    verifyToken: async (call, callback) => {
      try {
        const token = call.request.token;
        const user = await verifyAndGetUser(token);

        if (!user) {
          callback(null, { valid: false });
          return;
        }
        callback(null, {
          valid: true,
          user: {
            userId: user.userId || user.id,
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash || user.password_hash || "",
            role: user.role,
            avatar: user.avatar || "",
            createdAt: user.created_at?.toISOString() || "",
            updatedAt: user.updated_at?.toISOString() || ""
          }

        });
      } catch (error) {
        callback({ code: grpc.status.INTERNAL, message: error.message });
      }
    }
  });

  server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error("❌ Failed to start gRPC server:", err);
      return;
    }
    console.log(`✅ gRPC server running on port ${port}`);
  });

  return server;
}
