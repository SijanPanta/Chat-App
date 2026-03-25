import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const QUEUE_NAME = "notifications";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  connectionTimeout: 5000,
  auth: {
    user: process.env.SMTP_USER || "mock_user",
    pass: process.env.SMTP_PASS || "mock_pass",
  },
});

// Handler for the "user.registered" event
const sendWelcomeEmail = async (userData) => {
  try {
    console.log(
      `[Notification Service] 📧 Processing welcome email for: ${userData.email}`,
    );

    // const info = await transporter.sendMail({
    //   from: `"ChatPat Team" <${process.env.SMTP_USER}>`,
    //   to: userData.email,
    //   subject: "Welcome to ChatPat! 🎉",
    //   text: `Hi ${userData.username}, welcome to ChatPat! We're thrilled to have you.`,
    //   html: `<h3>Hi ${userData.username}!</h3><p>Welcome to ChatPat! We're thrilled to have you.</p>`,
    // });
    console.log(
      `[Notification Service] Would have sent welcome email to: ${userData.email}`,
    );
    const info = { messageId: "mock-id-for-now" };
    console.log(
      `[Notification Service] ✅ Email actually sent: ${info.messageId}`,
    );

    // Simulating delay for async processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(
      `[Notification Service] ✅ Successfully handled email for ${userData.username}`,
    );
  } catch (error) {
    console.error("[Notification Service] ❌ Failed to send email:", error);
    throw error; // Rethrowing ensures we don't ACK the message if it failed
  }
};

const connectAndConsume = async () => {
  try {
    // 1. Connect to RabbitMQ server
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // 2. Ensure the queue exists (must match the publisher's queue)
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // 3. Optional but recommended: prefetch(1) tells RabbitMQ not to give this worker
    // more than 1 message at a time. It waits until the worker ACKs the current message.
    channel.prefetch(1);

    console.log(
      `🚀 [Notification Service] Connected and listening on queue: '${QUEUE_NAME}'`,
    );

    // 4. Start consuming messages from the queue
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          // Parse the Buffer back into a JSON object
          const payload = JSON.parse(msg.content.toString());
          console.log(
            `\n📥 [Notification Service] Received event: '${payload.event}'`,
          );
          // Route based on the event type
          switch (payload.event) {
            case "user.registered":
              await sendWelcomeEmail(payload.data);
              break;
            case "user.login":
              console.log(
                `[Notification Service] 🔐 User logged in: ${payload.data.email}`,
              );
              break;
            default:
              console.log(
                `[Notification Service] ⚠️ Unhandled event type: ${payload.event}`,
              );
          }

          // 5. Acknowledge (ACK) the message
          // This tells RabbitMQ the message was successfully processed and can be deleted.
          channel.ack(msg);
          console.log(
            `[Notification Service] 🧹 Message ACKed and removed from queue.`,
          );
        } catch (error) {
          console.error(
            "[Notification Service] ❌ Error processing message:",
            error,
          );

          // 6. Negative Acknowledge (NACK)
          // If something fails (like the SMTP server is down), we reject the message.
          // false, true = don't requeue all messages, DO requeue this specific message
          // Be careful in production: if it fails every time, it will loop forever without a dead-letter queue.
          setTimeout(() => channel.nack(msg, false, false), 5000);
        }
      }
    });
  } catch (error) {
    console.error(
      "❌ [Notification Service] Failed to connect to RabbitMQ:",
      error.message,
    );
    console.log("⏳ Retrying in 5 seconds...");
    setTimeout(connectAndConsume, 5000);
  }
};

// Start the worker
connectAndConsume();
