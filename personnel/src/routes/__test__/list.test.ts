import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import {
  validPersonnel,
  testInvalidCookie,
  testRequiresAuth,
  testRouteHandler,
  testSignedInUser,
} from "./test.helper";
import { Personnel } from "../../models/personnel.model";

let prsnlId: string;

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

it("sends a list of personnels", async () => {
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
