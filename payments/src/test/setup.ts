import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
// import dotenv from "dotenv";
import { app } from "../app";

declare global {
  var signin: (id?: string) => string[];
}

// Load test environment variables
// dotenv.config({ path: ".env.test" });

// Redirect imports of nats-wrapper to the mock inside __mocks__
jest.mock("../nats-wrapper.ts");

// Use Stripe testing key
process.env.STRIPE_KEY = "STRIPE_TEST_KEY";

let mongo: MongoMemoryServer;

// Runs before all tests start
beforeAll(async () => {
  jest.clearAllMocks();

  // Ensure JWT key exists for tests
  process.env.JWT_KEY = "anything";

  // Start MongoDB in-memory server
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
},30000);

// Runs before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  for (let collection of collections!) {
    await collection.deleteMany({});
  }
});

// Runs after all tests complete
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Helper function to simulate authentication
global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create JWT token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Convert session to JSON
  const sessionJSON = JSON.stringify(session);

  // Encode as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Return cookie string
  return [`session=${base64}`];
};