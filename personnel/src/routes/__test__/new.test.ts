import request from "supertest";
import { app } from "../../app";

import { Personnel } from "../../models/personnel.model";
import {
  validPersonnel,
  testInvalidCookie,
  testRequiresAuth,
  testRouteHandler,
  testSignedInUser,
  testInput,
  validationTest,
} from "./test.helper";
import { natsConnector } from "../../nats-connector";

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

it("returns an AJV validation error if an invalid personnel is provided", async () => {
  await validationTest(`/api/personnels`, "post");
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
  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(201);

  expect(natsConnector.client.publish).toHaveBeenCalled();
});
