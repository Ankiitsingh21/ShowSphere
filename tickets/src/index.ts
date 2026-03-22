import mongoose from "mongoose";
// import { DatabaseConnectionError } from "@showsphere/common";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listener/order-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("mongodb url is incorrect");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is incorrect");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is incorrect");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL is incorrect");
  }

  try {
    // console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log("Mongo connection failed. Retrying...");
    setTimeout(start, 5000);
    // throw new DatabaseConnectionError()
    return;
  }

  app.listen(3000, () => {
    console.log("Starting Enginee ....")
    console.log(`Listening on ${3000}`);
  });
};

start();
