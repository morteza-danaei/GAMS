import request from "supertest";
import { app } from "../../app";

import { Personnel, PrsnlProps } from "../../models/personnel.model";
import {
  testRouteHandler,
  testRequiresAuth,
  testInvalidCookie,
  testSignedInUser,
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

let prsnlId: string;

describe("API tests", () => {
  it(
    "has a route handler listening to /api/personnels for GET requests",
    testRouteHandler(
      "/api/personnels",
      "get",
      200,
      "asdfasdf",
      validPersonnel,
      expect,
      app
    )
  );

  it(
    "can only be accessed if the user is signed in",
    testRequiresAuth("/api/personnels", "get", 401, app)
  );

  it(
    "returns 401 when cookie is tampered/invalid",
    testInvalidCookie("/api/personnels", "get", 401, app)
  );

  it(
    "returns a status other than 401 if the user is signed in",
    testSignedInUser("/api/personnels", "get", 401, "asdfasdf", app)
  );
});

it("sends a list of personnels if user is signed in correctly", async () => {
  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(validPersonnel)
    .expect(201);

  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign(validPersonnel, { nid: "2134567890" }))
    .expect(201);

  await request(app)
    .post("/api/personnels")
    .set("Cookie", await global.signin())
    .send(Object.assign(validPersonnel, { nid: "2134657890" }))
    .expect(201);

  const response = await request(app)
    .get(`/api/personnels`)
    .set("Cookie", await global.signin())
    .expect(200);

  expect(response.body.length).toBe(3);

  const personnels = await Personnel.find({});
  expect(personnels.length).toBe(3);
});
