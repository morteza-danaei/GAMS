import request from "supertest";
import { app } from "../../app";

import { Personnel, PrsnlProps } from "../../models/personnel.model";
import { natsConnector } from "../../nats-connector";
import { personnelSchema } from "../ajv/ajv-schemas";
import {
  testRouteHandler,
  testRequiresAuth,
  testInvalidCookie,
  testSignedInUser,
  stringAjvValidationTest,
} from "@gams/utility";

/**
 * a valid personnel to use for testing the creation of new personnel
 */
const validPersonnel: PrsnlProps = {
  nid: "ksdjflskdj",
  pid: "fjksdhdd",
  name: "kdjsla",
  lastname: "sadhf",
  department: "fsadf",
};

const LONG_STRING =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const criteria = [
  ["minLength", ""],
  ["maxLength", LONG_STRING],
  ["type", 5],
  ["required", ""],
];

describe("API tests", () => {
  it(
    "has a route handler listening to //api/personnels for POST requests",
    testRouteHandler(
      "/api/personnels",
      "post",
      201,
      "asdfasdf",
      validPersonnel,
      expect,
      app
    )
  );

  it(
    "can only be accessed if the user is signed in",
    testRequiresAuth("/api/personnels", "post", 401, app)
  );

  it(
    "returns 401 when cookie is tampered/invalid",
    testInvalidCookie("/api/personnels", "post", 401, app)
  );

  it(
    "returns a status other than 401 if the user is signed in",
    testSignedInUser("/api/personnels", "post", 401, "asdfasdf", app)
  );
});

it("returns an AJV validation error if an invalid personnel is provided", async () => {
  await stringAjvValidationTest(
    `/api/personnels`,
    "post",
    criteria,
    validPersonnel,
    app,
    expect,
    personnelSchema
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

it("publishes an event with subject Personnel:created", async () => {
  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(201);

  expect(natsConnector.client.publish).toHaveBeenCalledWith(
    "Personnel:created", // Expected subject value
    expect.any(String),
    expect.any(Function)
  );
});
