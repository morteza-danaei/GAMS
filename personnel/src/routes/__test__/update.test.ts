import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Personnel, PrsnlDoc, PrsnlModel } from "../../models/personnel.model";
import {
  validPersonnel,
  testInvalidCookie,
  testRequiresAuth,
  testRouteHandler,
  testSignedInUser,
  testInput,
  testUpdateProperty,
  validationTest,
} from "./test.helper";
import { natsConnector } from "../../nats-connector";

let prsnlId: string;

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
    await testRouteHandler(`/api/personnels/${prsnlId}`);
  });

  it("can only be accessed if the user is signed in", async () => {
    await getPersonnelId();
    await testRequiresAuth(`/api/personnels/${prsnlId}`);
  });

  it("returns 401 when cookie is tampered/invalid", async () => {
    await getPersonnelId();
    await testInvalidCookie(`/api/personnels/${prsnlId}`);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    await getPersonnelId();
    await testSignedInUser(`/api/personnels/${prsnlId}`);
  });
});

it("returns an AJV validation error if an invalid personnel is provided", async () => {
  await getPersonnelId();
  await validationTest(`/api/personnels/${prsnlId}`, "put");
});

it("returns a 404 if the personnel is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
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
    Personnel
  );

  // test updating "pid"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "pid",
    "11111111",
    Personnel
  );

  // test updating "name"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "name",
    "aaaaaa",
    Personnel
  );

  // test updating "lastname"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "lastname",
    "bbbbbb",
    Personnel
  );

  // test updating "department"
  await testUpdateProperty(
    `/api/personnels/${personnelId}`,
    validPersonnel,
    "department",
    "cccccc",
    Personnel
  );
});

it("publishes a personnel:updated event", async () => {
  await getPersonnelId();
  await request(app)
    .put(`/api/personnels/${prsnlId}`)
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { name: "ggggg" }))
    .expect(200);

  expect(natsConnector.client.publish).toHaveBeenCalled();
});
