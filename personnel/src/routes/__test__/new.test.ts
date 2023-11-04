import request from "supertest";
import { app } from "../../app";

import { Personnel } from "../../models/personnel.model";
import {
  validPersonnel,
  testInvalidCookie,
  testRequiresAuth,
  testRouteHandler,
  testSignedInUser,
} from "./test.helper";
import { natsConnector } from "../../nats-connector";

/**
 *  gets a property name and a value  and a message
 *  and tests if the error message recieved after updating
 *  the property value of a valid personnel to the new one
 *
 * @param key - The property name
 * @param newValue - The new value
 * @param message - The error message that is exected to recieve
 */
const testInput = async (
  key: string,
  newValue: string | number | undefined,
  message: string
) => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { [key]: newValue }))
    .expect(400);
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe(message);
};

describe("API tests", () => {
  it(
    "has a route handler listening to /api/personnels for get requests",
    testRouteHandler("/api/personnels")
  );

  it(
    "can only be accessed if the user is signed in",
    testRequiresAuth("/api/personnels")
  );

  it(
    "returns 401 when cookie is tampered/invalid",
    testInvalidCookie("/api/personnels")
  );

  it(
    "returns a status other than 401 if the user is signed in",
    testSignedInUser("/api/personnels")
  );
});

it("returns a validation error if an invalid pid is provided", async () => {
  testInput("pid", "1234567", "pid  must be exactly 8 characters");
  testInput("pid", 1, "pid  must be string");
});

it("returns a validation error if no pid is provided", async () => {
  testInput("pid", undefined, ' should have a string property "pid"');
});

it("returns a validation error if  invalid nid is provided", async () => {
  testInput("nid", "123456789", "nid  must be exactly 10 characters");
  testInput("nid", 1, "nid  must be string");
});

it("returns a validation error if no  nid is provided", async () => {
  testInput("nid", undefined, ' should have a string property "nid"');
});

it("returns a validation error if an invalid name is provided", async () => {
  testInput("name", 1, "name  must be string");
});

it("returns a validation error if no name is provided", async () => {
  testInput("name", undefined, ' should have a string property "name"');
});

it("returns a validation error if invalid  lastname is provided", async () => {
  testInput("lastname", 1, "lastname  must be string");
});

it("returns a validation error if no lastname is provided", async () => {
  testInput("lastname", undefined, ' should have a string property "lastname"');
});

it("returns a validation error if invalid department is provided", async () => {
  testInput("department", 1, "department  must be string");
});

it("returns a validation error if no department is provided", async () => {
  testInput(
    "department",
    undefined,
    ' should have a string property "department"'
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

it("publishes an event", async () => {
  const title = "asldkfj";

  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(201);

  expect(natsConnector.client.publish).toHaveBeenCalled();
});
