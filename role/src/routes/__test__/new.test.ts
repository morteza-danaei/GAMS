import request from "supertest";
import { app } from "../../app";

import { Role, RoleProps } from "../../models/role.model";
import { natsConnector } from "../../nats-connector";
import { roleSchema } from "../ajv/ajv-schemas";
import {
  testRouteHandler,
  testRequiresAuth,
  testInvalidCookie,
  testSignedInUser,
  stringAjvValidationTest,
} from "@gams/utility";

/**
 * a valid role to use for testing the creation of new role
 */
const validRole: RoleProps = {
  name: "kdjsla",
};

const LONG_STRING =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const criteria = [
  ["minLength", ""],
  ["maxLength", LONG_STRING],
  ["type", 5],
  ["required", ""],
];

describe("API tests", () => {
  it(
    "has a route handler listening to /api/roles for POST requests",
    testRouteHandler(
      "/api/roles",
      "post",
      201,
      "asdfasdf",
      validRole,
      expect,
      app
    )
  );

  it(
    "can only be accessed if the user is signed in",
    testRequiresAuth("/api/roles", "post", 401, app)
  );

  it(
    "returns 401 when cookie is tampered/invalid",
    testInvalidCookie("/api/roles", "post", 401, app)
  );

  it(
    "returns a status other than 401 if the user is signed in",
    testSignedInUser("/api/roles", "post", 401, "asdfasdf", app)
  );
});

it("returns an AJV validation error if an invalid role is provided", async () => {
  await stringAjvValidationTest(
    `/api/roles`,
    "post",
    criteria,
    validRole,
    app,
    expect,
    roleSchema
  );
});

it("returns a validation error if the role name is in use", async () => {
  await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole)
    .expect(201);

  const response = await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole)
    .expect(400);

  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0].message).toBe("Role already exists");
});

it("creates a role if a valid role is provided", async () => {
  let roles = await Role.find({});
  expect(roles.length).toEqual(0);

  await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole)
    .expect(201);

  roles = await Role.find({});

  expect(roles.length).toEqual(1);
  expect(roles[0].name).toEqual("kdjsla");
});

it("publishes an event with subject Role:created", async () => {
  await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole)
    .expect(201);

  expect(natsConnector.client.publish).toHaveBeenCalledWith(
    "Role:created", // Expected subject value
    expect.any(String),
    expect.any(Function)
  );
});
