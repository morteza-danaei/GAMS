import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { validPersonnel } from "../../helpers/test.helper";
import { Personnel } from "../../models/personnel.model";

let prsnlId: string;

/**
 * Creates a new  Personnel  document in db and fetches the ID of a personnel.

 * This function makes a POST request to the `/api/personnels` endpoint to create a new personnel. 
 * It then fetches all personnels from the database and returns the ID of the first and only personnel since the db was empty before.

 * It assigns the prsnlId variable with the ID of a personnel created by the current user.
 */

it("has a route handler listening to /api/personnels for get requests", async () => {
  const response = await request(app)
    .get(`/api/personnels`)
    .set("Cookie", await global.signin());
  expect(response.status).toBe(200);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).get(`/api/personnels`).expect(401);
});

it("returns 401 when cookie is tampered/invalid", async () => {
  await request(app)
    .get(`/api/personnels`)
    .set("Cookie", "fsadfsdfsadfsa")
    .expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .get(`/api/personnels`)
    .set("Cookie", await global.signin());

  expect(response.status).not.toEqual(401);
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
