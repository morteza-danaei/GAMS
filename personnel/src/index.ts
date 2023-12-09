import mongoose from "mongoose";

import { app } from "./app";
import { natsConnector } from "./nats-connector";
import { RoleCreatedListener } from "./helpers/event/role-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    await natsConnector.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsConnector.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    /**
     * Sets up a listener to close the NATS connection when the process receives a SIGINT or SIGTERM signal.
     */
    process.on("SIGINT", () => natsConnector.client.close());
    process.on("SIGTERM", () => natsConnector.client.close());

    new RoleCreatedListener(natsConnector.client).listen();

    //connect to mongoose
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
