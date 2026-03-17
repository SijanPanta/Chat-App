import amqp from "amqplib";

let channel = null;
let connection = null;

// The queue we want to send messages to
const QUEUE_NAME = "notifications";

export const connectRabbitMQ = async () => {
  try {
    const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://localhost";
    connection = await amqp.connect(rabbitMqUrl);
    channel = await connection.createChannel();

    // Ensure the queue exists before trying to send to it
    // durable: true means the queue survives RabbitMQ restarts
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("✅ [auth-services] Connected to RabbitMQ");
  } catch (error) {
    console.error("❌ [auth-services] Failed to connect to RabbitMQ:", error);
    // Optional: add retry logic here in a real production app
  }
};

export const publishEvent = async (eventType, payload) => {
  if (!channel) {
    console.error("❌ [auth-services] RabbitMQ channel not initialized");
    return;
  }

  const message = {
    event: eventType,
    data: payload,
    timestamp: new Date().toISOString(),
  };

  try {
    // Convert object to a Buffer to send it over the wire
    const buffer = Buffer.from(JSON.stringify(message));

    // Publish directly to the queue
    channel.sendToQueue(QUEUE_NAME, buffer, {
      persistent: true, // Messages survive broker restarts if queue is durable
    });

    console.log(`📤 [auth-services] Published event '${eventType}' to queue`);
  } catch (error) {
    console.error(`❌ [auth-services] Failed to publish event '${eventType}':`, error);
  }
};
