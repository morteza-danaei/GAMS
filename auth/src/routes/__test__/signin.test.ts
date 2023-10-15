import request from "supertest";
import { app } from "../../app";
import {
  validSigninUser,
  validSignupUser,
  changePropertyValue,
} from "../../helpers/test.helper";

it("fails when a username that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send(validSigninUser)
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send(validSignupUser)
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send(changePropertyValue(validSignupUser, "password", "aaa"))
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send(validSignupUser)
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send(validSigninUser)
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
