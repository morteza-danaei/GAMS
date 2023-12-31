import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  function signin(): Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// a global function to be used for signin in tests
global.signin = async () => {
  const username = "d38240undhhhfl";
  const password = "Aa!328794skhdnf";
  const repeat_password = "Aa!328794skhdnf";
  const email = "a@daad.com";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      username,
      password,
      repeat_password,
      email,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
