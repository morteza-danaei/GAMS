import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Personnel, PrsnlProps } from "../../models/personnel.model";
import { natsConnector } from "../../nats-connector";
import { personnelSchema } from "../ajv/ajv-schemas";
import {
  testRouteHandler,
  testRequiresAuth,
  testInvalidCookie,
  testSignedInUser,
  stringAjvValidationTest,
  testUpdateProperty,
} from "@gams/utility";

let prsnlId: string;

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

/**
 * Criteria array for string validation tests.
 *
 * Each sub-array in the criteria array represents a validation scenario with two elements:
 * 1. Validation criterion (e.g., "minLength", "maxLength", "type", "required").
 * 2. Associated value for the validation criterion.
 *
 * Example:
 * ```
 * const criteria = [
 *   ["minLength", ""],             // Test minLength validation with an empty string
 *   ["maxLength", LONG_STRING],    // Test maxLength validation with a long string
 *   ["type", 5],                   // Test type validation with the value 5
 *   ["required", ""],              // Test required validation with an empty string
 * ];
 * ```
 */
const criteria = [
  ["minLength", ""],
  ["maxLength", LONG_STRING],
  ["type", 5],
  ["required", ""],
];

/**
 * Creates a new  Personnel  document in db and fetches the ID of a personnel.

 * This function makes a POST request to the `/api/personnels` endpoint to create a new personnel. 
 * It then fetches all personnels from the database and returns the ID of the first and only personnel since the db was empty before.

 * It assigns the prsnlId variable with the ID of a personnel created by the current user.
 */
const getPersonnelId = async () => {
  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel);
  const personnels = await Personnel.find(validPersonnel);
  expect(personnels.length).toBe(1);
  prsnlId = personnels[0].id.toString();
};

describe("API tests", () => {
  it("has a route handler listening to /api/personnels for get requests", async () => {
    await getPersonnelId();
    testRouteHandler(
      `/api/personnels/${prsnlId}`,
      "get",
      200,
      "asdfasdf",
      validPersonnel,
      expect,
      app
    );
  });

  it("can only be accessed if the user is signed in", async () => {
    await getPersonnelId();
    testRequiresAuth(`/api/personnels/${prsnlId}`, "put", 401, app);
  });

  it("returns 401 when cookie is tampered/invalid", async () => {
    await getPersonnelId();
    testInvalidCookie(`/api/personnels/${prsnlId}`, "put", 401, app);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    await getPersonnelId();
    testSignedInUser(`/api/personnels/${prsnlId}`, "put", 401, "asdfasdf", app);
  });
});

it("returns an AJV validation error if an invalid personnel is provided", async () => {
  await getPersonnelId();

  //test the validation of inputs based on scenarios in criteria
  await stringAjvValidationTest(
    `/api/personnels/${prsnlId}`,
    "put",
    criteria,
    validPersonnel,
    app,
    expect,
    personnelSchema
  );
});

it("returns a 404 if the personnel is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/personnels/${id}`)
    .set("Cookie", await global.signin())
    .send()
    .expect(404);
});

it("update a personnel if a valid personnel is provided", async () => {
  let personnels = await Personnel.find({});
  expect(personnels.length).toEqual(0);

  const response = await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(201);

  const personnels1 = await Personnel.find(validPersonnel);
  expect(personnels1.length).toBe(1);
  const personnelId = personnels1[0].id.toString();

  // test updating "nid"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "nid",
    "0000000000",
    Personnel,
    app,
    "asdfasdf",
    expect
  );

  // test updating "pid"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "pid",
    "11111111",
    Personnel,
    app,
    "asdfasdf",
    expect
  );

  // test updating "name"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "name",
    "aaaaaa",
    Personnel,
    app,
    "asdfasdf",
    expect
  );

  // test updating "lastname"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "lastname",
    "bbbbbb",
    Personnel,
    app,
    "asdfasdf",
    expect
  );

  // test updating "department"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "department",
    "cccccc",
    Personnel,
    app,
    "asdfasdf",
    expect
  );
});

it("publishes an event with subject Personnel:updated", async () => {
  await getPersonnelId();
  await request(app)
    .put(`/api/personnels/${prsnlId}`)
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { name: "ggggg" }))
    .expect(200);

  expect(natsConnector.client.publish).toHaveBeenCalledWith(
    "Personnel:updated", // Expected subject value
    expect.any(String),
    expect.any(Function)
  );
});
