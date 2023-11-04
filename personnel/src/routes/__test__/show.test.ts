import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import {
  testInvalidCookie,
  testRequiresAuth,
  testRouteHandler,
  testSignedInUser,
  validPersonnel,
} from "./test.helper";
import { Personnel } from "../../models/personnel.model";

let prsnlId: string;

/**
 * Creates a new  Personnel  document in db and fetches the ID of a personnel.

 * This function makes a POST request to the `/api/personnels` endpoint to create a new personnel. 
 * It then fetches all personnels from the database and returns the ID of the first and only personnel since the db was empty before.

 * It assigns the prsnlId variable with the ID of a personnel created by the current user.
 */
const personnelId = async () => {
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
    await personnelId();
    testRouteHandler(`/api/personnels/${prsnlId}`);
  });

  it("can only be accessed if the user is signed in", async () => {
    await personnelId();
    testRequiresAuth(`/api/personnels/${prsnlId}`);
  });

  it("returns 401 when cookie is tampered/invalid", async () => {
    await personnelId();
    testInvalidCookie(`/api/personnels/${prsnlId}`);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    await personnelId();
    testSignedInUser(`/api/personnels/${prsnlId}`);
  });
});

it("returns a 404 if the personnel is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the personnel if the personnel is found", async () => {
  await personnelId();

  const response = await request(app)
    .get(`/api/personnels/${prsnlId}`)
    .set("Cookie", await global.signin())
    .expect(200);

  expect(response.body.pid).toEqual("fjksdhdd");
  expect(response.body.nid).toEqual("ksdjflskdj");
  expect(response.body.name).toEqual("kdjsla");
  expect(response.body.lastname).toEqual("sadhf");
  expect(response.body.department).toEqual("fsadf");
});
