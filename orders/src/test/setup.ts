import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// global signup function
declare global {
  var signin: () => string[];
}

/**
 * Use mongodb memory srever for test env
 * Copy of mongodb in memory
 *
 */

import { app } from "../app";
import request from "supertest";

jest.mock("../nats-wrapper");

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
},30000);

/**
 *  Run before eeach test
 *  clear the db by deleting every collection
 */
beforeEach(async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  //Build  a JWT payload
  const id = new mongoose.Types.ObjectId().toHexString();

  const payload = {
    id: id,
    email: "asdwqdw@mail.com",
  };

  //create the jwt!

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session Object. {jst:MY_JWT}
  const session = { jwt: token };

  //Turn theat session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base 64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
