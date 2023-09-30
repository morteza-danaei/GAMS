import request from "supertest";
import { app } from "../../app";

interface User {
  username: string;
  password: string;
  repeat_password: string;
  email: string;
}
const validUser: User = {
  username: "d38240undfl",
  password: "fsdfsadfasd1",
  repeat_password: "fsdfsadfasd1",
  email: "a@dd.com",
};

function changePropertyValue<T extends Object, K extends keyof T>(
  object: T,
  propertyName: K,
  newValue: any
): T {
  const newObject = Object.assign({}, object);
  newObject[propertyName] = newValue;
  return newObject;
}

it("returns a 201 on successful signup", async () => {
  return request(app).post("/api/users/signup").send(validUser).expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send(changePropertyValue(validUser, "email", "sss"))
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send(changePropertyValue(validUser, "email", "sss"))
    .expect(400);
});

it("returns a 400 with missing username, password, repeat_password and email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validUser, { username: undefined }))
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validUser, { password: undefined }))
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validUser, { repeat_password: undefined }))
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send(Object.assign({}, validUser, { email: undefined }))
    .expect(400);
});

it("disallows duplicate username", async () => {
  await request(app).post("/api/users/signup").send(validUser).expect(201);

  // signup with the same username but different email address
  await request(app)
    .post("/api/users/signup")
    .send(changePropertyValue(validUser, "email", "a@d.com"))
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send(validUser)
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
