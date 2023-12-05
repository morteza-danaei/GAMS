import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Role, RoleProps } from "../../models/role.model";
import { natsConnector } from "../../nats-connector";
import { roleSchema } from "../ajv/ajv-schemas";
import {
  testRouteHandler,
  testRequiresAuth,
  testInvalidCookie,
  testSignedInUser,
  stringAjvValidationTest,
  testUpdateProperty,
} from "@gams/utility";

let roleId: string;

/**
 * a valid role to use for testing the creation of new role
 */
const validRole: RoleProps = {
  name: "kdjsla",
};

const LONG_STRING =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const criteria = [
  ["minLength", ""],
  ["maxLength", LONG_STRING],
  ["type", 5],
  ["required", ""],
];

/**
 * Creates a new  Role  document in db and fetches the ID of a role.

 * This function makes a POST request to the `/api/roles` endpoint to create a new role. 
 * It then fetches all roles from the database and returns the ID of the first and only role since the db was empty before.

 * It assigns the roleId variable with the ID of a role created by the current user.
 */
const getRoleId = async () => {
  const response = await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole);
  const roles = await Role.find(validRole);
  expect(roles.length).toBe(1);
  roleId = roles[0].id.toString();
};

describe("API tests", () => {
  it("has a route handler listening to /api/roles for delete requests", async () => {
    await getRoleId();
    testRouteHandler(
      `/api/roles/${roleId}`,
      "delete",
      200,
      "asdfasdf",
      validRole,
      expect,
      app
    );
  });

  it("can only be accessed if the user is signed in", async () => {
    await getRoleId();
    testRequiresAuth(`/api/roles/${roleId}`, "put", 401, app);
  });

  it("returns 401 when cookie is tampered/invalid", async () => {
    await getRoleId();
    testInvalidCookie(`/api/roles/${roleId}`, "put", 401, app);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    await getRoleId();
    testSignedInUser(`/api/roles/${roleId}`, "put", 401, "asdfasdf", app);
  });
});

it("returns a 404 if the role is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/roles/${id}`)
    .set("Cookie", await global.signin())
    .send()
    .expect(404);
});

it("deletes a role if a valid role id is provided", async () => {
  let roles = await Role.find({});
  expect(roles.length).toEqual(0);

  const response = await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole)
    .expect(201);

  const rolesAfterCreate = await Role.find(validRole);
  expect(rolesAfterCreate.length).toBe(1);
  const roleId = rolesAfterCreate[0].id.toString();

  await request(app)
    .delete(`/api/roles/${roleId}`)
    .set("Cookie", await global.signin())
    .send()
    .expect(200);

  const rolesAfterDelete = await Role.find({});
  expect(rolesAfterDelete.length).toEqual(0);
});

it("publishes an event with subject Role:deleted", async () => {
  await getRoleId();
  await request(app)
    .put(`/api/roles/${roleId}`)
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validRole, { name: "ggggg" }))
    .expect(200);

  expect(natsConnector.client.publish).toHaveBeenCalledWith(
    "Role:updated", // Expected subject value
    expect.any(String),
    expect.any(Function)
  );
});
