import request from "supertest";
import { app } from "../../app";

import { Role, RoleProps } from "../../models/role.model";
import {
  testRouteHandler,
  testRequiresAuth,
  testInvalidCookie,
  testSignedInUser,
} from "@gams/utility";

/**
 * a valid role to use for testing the creation of new role
 */
const validRole: RoleProps = {
  name: "kdjsla",
};

let prsnlId: string;

describe("API tests", () => {
  it(
    "has a route handler listening to /api/roles for GET requests",
    testRouteHandler(
      "/api/roles",
      "get",
      200,
      "asdfasdf",
      validRole,
      expect,
      app
    )
  );

  it(
    "can only be accessed if the user is signed in",
    testRequiresAuth("/api/roles", "get", 401, app)
  );

  it(
    "returns 401 when cookie is tampered/invalid",
    testInvalidCookie("/api/roles", "get", 401, app)
  );

  it(
    "returns a status other than 401 if the user is signed in",
    testSignedInUser("/api/roles", "get", 401, "asdfasdf", app)
  );
});

it("sends a list of roles if user is signed in correctly", async () => {
  await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(validRole)
    .expect(201);

  await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(Object.assign(validRole, { name: "2134567890" }))
    .expect(201);

  await request(app)
    .post("/api/roles")
    .set("Cookie", await global.signin())
    .send(Object.assign(validRole, { name: "2134657890" }))
    .expect(201);

  const response = await request(app)
    .get(`/api/roles`)
    .set("Cookie", await global.signin())
    .expect(200);

  expect(response.body.length).toBe(3);

  const roles = await Role.find({});
  expect(roles.length).toBe(3);
});
