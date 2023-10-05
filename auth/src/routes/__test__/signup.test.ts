import request from "supertest";
import { app } from "../../app";

import {
  validSigninUser,
  validSignupUser,
  changePropertyValue,
} from "../../test/test-helper";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send(validSignupUser)
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send(changePropertyValue(validSignupUser, "email", "sss"))
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send(changePropertyValue(validSignupUser, "email", "sss"))
    .expect(400);
});

it("returns a 400 with missing username, password, repeat_password and email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validSignupUser, { username: undefined }))
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validSignupUser, { password: undefined }))
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validSignupUser, { repeat_password: undefined }))
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validSignupUser, { email: undefined }))
    .expect(400);
});

it("disallows duplicate username", async () => {
  await request(app)
    .post("/api/users/signup")
    .send(validSignupUser)
    .expect(201);

  // signup with the same username but different email address
  await request(app)
    .post("/api/users/signup")
    .send(changePropertyValue(validSignupUser, "email", "a@d.com"))
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(validSignupUser)
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
