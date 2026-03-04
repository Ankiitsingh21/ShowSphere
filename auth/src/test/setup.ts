import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// global signup function
declare global {
      var signin: () => Promise<string[]>;
}

/**
 * Use mongodb memory srever for test env
 * Copy of mongodb in memory
 *
 */

import { app } from "../app";
import request from "supertest";

let mongo: any;
/**
 * run before every test
 * connect mongosse to mongodb in memory
 */
beforeAll(async () => {
  process.env.JWT_KEY = "asddf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

/**
 *  Run before eeach test
 *  clear the db by deleting every collection
 */
beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  for (let collection of collections!) {
    await collection.deleteMany({});
  }
});

/**
 *  Run after all our test are complete
 */

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cokkie = response.get("Set-Cookie") || [];

  return cokkie;
};
