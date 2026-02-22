import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat App API",
      version: "1.0.0",
      description:
        "REST API documentation for Chat App. Use the Authorize button to set your JWT token.",
    },
    servers: [
      {
        url: "http://localhost:3030",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token (without the 'Bearer' prefix)",
        },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 3,
              example: "john_doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 8,
              example: "Secret@123",
              description:
                "Min 8 chars, must include uppercase, lowercase, number, and special character",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              example: "Secret@123",
            },
          },
        },
        PasswordResetRequest: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: {
              type: "string",
              example: "Secret@123",
            },
            newPassword: {
              type: "string",
              minLength: 8,
              example: "NewSecret@456",
              description:
                "Must differ from old password. Min 8 chars with uppercase, lowercase, number, special character.",
            },
          },
        },

        // ── User ──────────────────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            userId: { type: "integer", example: 1 },
            username: { type: "string", example: "john_doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            profilePicture: {
              type: "string",
              nullable: true,
              example: "/uploads/profiles/profile-1.jpeg",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ── Post ──────────────────────────────────────────────────────────
        Post: {
          type: "object",
          properties: {
            postId: { type: "integer", example: 42 },
            content: { type: "string", example: "Hello world!" },
            postImage: {
              type: "string",
              nullable: true,
              example: "/uploads/posts/post-1234567890.jpeg",
            },
            categories: {
              type: "array",
              items: { type: "string" },
              example: ["Technology", "News"],
            },
            author: { type: "string", example: "john_doe" },
            userId: { type: "integer", example: 1 },
            likesCount: { type: "integer", example: 5 },
            isLiked: { type: "boolean", example: false },
            commentsCount: { type: "integer", example: 3 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PaginatedPosts: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: { $ref: "#/components/schemas/Post" },
            },
            totalPages: { type: "integer", example: 5 },
            currentPage: { type: "integer", example: 1 },
            totalCount: { type: "integer", example: 48 },
          },
        },

        // ── Comment ───────────────────────────────────────────────────────
        Comment: {
          type: "object",
          properties: {
            commentId: { type: "integer", example: 7 },
            content: { type: "string", example: "Great post!" },
            postId: { type: "integer", example: 42 },
            userId: { type: "integer", example: 1 },
            username: { type: "string", example: "john_doe" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateCommentRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", example: "Great post!" },
          },
        },
        PaginatedComments: {
          type: "object",
          properties: {
            comments: {
              type: "array",
              items: { $ref: "#/components/schemas/Comment" },
            },
            totalPages: { type: "integer", example: 2 },
            currentPage: { type: "integer", example: 1 },
          },
        },

        // ── Generic ───────────────────────────────────────────────────────
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Something went wrong" },
          },
        },
        MessageResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Operation successful" },
          },
        },
      },
    },
    // Apply bearer auth globally — individual endpoints can override with security: []
    security: [{ bearerAuth: [] }],
  },
  // Glob paths are resolved relative to where the process is started (project root)
  apis: ["./backend/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
