import request from "supertest";
import { app } from "../../app";

import { Personnel } from "../../models/personnel.model";
import { validPersonnel } from "../../helpers/test.helper";

it("has a route handler listening to /api/personnels for post requests", async () => {
  const response = await request(app).post("/api/personnels").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/personnels").send({}).expect(401);
});

it("returns 401 when cookie is tampered/invalid", async () => {
  await request(app)
    .post("/api/personnels")
    .set("Cookie", "fsadfsdfsadfsa")
    .send({})
    .expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns a validation error if an invalid pid is provided", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { pid: "1234567" }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(
    "pid  must be exactly 8 characters"
  );

  const response2 = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { pid: 1 }))
    .expect(400);
  expect(response2.body.errors.length).toBe(1);
  expect(response2.body.errors[0].message).toBe("pid  must be string");
});

it("returns a validation error if no pid is provided", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { pid: undefined }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(
    ' should have a string property "pid"'
  );
});

it("returns a validation error if  invalid nid is provided", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { nid: "123456789" }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(
    "nid  must be exactly 10 characters"
  );

  const response2 = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { nid: 1 }))
    .expect(400);
  expect(response2.body.errors.length).toBe(1);
  expect(response2.body.errors[0].message).toBe("nid  must be string");
});

it("returns a validation error if no  nid is provided", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { nid: undefined }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(
    ' should have a string property "nid"'
  );
});

it("returns a validation error if the nid  is in use", async () => {
  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(201);

  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(400);

  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe("nid in use");
});

it("returns a validation error if an invalid name is provided", async () => {
  const response2 = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { name: 1 }))
    .expect(400);
  expect(response2.body.errors.length).toBe(1);
  expect(response2.body.errors[0].message).toBe("name  must be string");
});

it("returns a validation error if no name is provided", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { name: undefined }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(
    ' should have a string property "name"'
  );
});

it("returns a validation error if invalid  lastname is provided", async () => {
  const response2 = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { lastname: 1 }))
    .expect(400);
  expect(response2.body.errors.length).toBe(1);
  expect(response2.body.errors[0].message).toBe("lastname  must be string");
});

it("returns a validation error if no lastname is provided", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { lastname: undefined }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(
    ' should have a string property "lastname"'
  );
});

it("returns a validation error if invalid department is provided", async () => {
  const response2 = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { department: 1 }))
    .expect(400);
  expect(response2.body.errors.length).toBe(1);
  expect(response2.body.errors[0].message).toBe("department  must be string");
});

it("returns a validation error if no department is provided", async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { department: undefined }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(
    ' should have a string property "department"'
  );
});

it("creates a personnel if a valid personnel is provided", async () => {
  let prsnls = await Personnel.find({});
  expect(prsnls.length).toEqual(0);

  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(201);
  prsnls = await Personnel.find({});
  expect(prsnls.length).toEqual(1);
  expect(prsnls[0].nid).toEqual("ksdjflskdj");
  expect(prsnls[0].pid).toEqual("fjksdhdd");
  expect(prsnls[0].name).toEqual("kdjsla");
  expect(prsnls[0].lastname).toEqual("sadhf");
  expect(prsnls[0].department).toEqual("fsadf");
});

it("publishes an event", async () => {});
