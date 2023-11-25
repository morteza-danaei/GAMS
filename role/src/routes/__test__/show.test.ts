import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Role, RoleProps } from "../../models/role.model";
import {
  testRouteHandler,
  testRequiresAuth,
  testInvalidCookie,
  testSignedInUser,
} from "@gams/utility";

let roleId: string;

/**
 * a valid role to use for testing the creation of new role
 */
const validRole: RoleProps = {
  name: "kdjsla",
};

/**
 * Creates a new  Role  document in db and fetches the ID of a role.

 * This function makes a POST request to the `/api/roles` endpoint to create a new role. 
 * It then fetches all roles from the database and returns the ID of the first and only role since the db was empty before.

 * It assigns the roleId variable with the ID of a role created by the current user.
 */
const getPersonnelId = async () => {
  const response = await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole);
  const roles = await Role.find(validRole);
  expect(roles.length).toBe(1);
  roleId = roles[0].id.toString();
};

describe("API tests", () => {
  it("has a route handler listening to /api/roles for get requests", async () => {
    await getPersonnelId();
    testRouteHandler(
      `/api/roles/${roleId}`,
      "get",
      200,
      "asdfasdf",
      validRole,
      expect,
      app
    );
  });

  it("can only be accessed if the user is signed in", async () => {
    await getPersonnelId();
    testRequiresAuth(`/api/roles/${roleId}`, "get", 401, app);
  });

  it("returns 401 when cookie is tampered/invalid", async () => {
    await getPersonnelId();
    testInvalidCookie(`/api/roles/${roleId}`, "get", 401, app);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    await getPersonnelId();
    testSignedInUser(`/api/roles/${roleId}`, "get", 401, "asdfasdf", app);
  });
});

it("returns a 404 if the role is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/roles/${id}`)
    .set("Cookie", await global.signin())
    .send()
    .expect(404);
});

it("returns the role if the role is found", async () => {
  await getPersonnelId();

  const response = await request(app)
    .get(`/api/roles/${roleId}`)
    .set("Cookie", await global.signin())
    .expect(200);

  expect(response.body.name).toEqual("kdjsla");
});
