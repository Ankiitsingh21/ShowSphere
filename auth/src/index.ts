import mongoose from "mongoose";
// import { DatabaseConnectionError } from "@showsphere/common";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://mongo-auth-srv:27017/auth");
    console.log("connected to mongodb");
  } catch (err) {
    console.log("Mongo connection failed. Retrying...");
    setTimeout(start, 5000);
    // throw new DatabaseConnectionError()
    return;
  }

  app.listen(3000, () => {
    console.log(`Listening on ${3000}`);
  });
};

start();
