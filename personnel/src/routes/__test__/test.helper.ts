import { PrsnlProps } from "../../models/personnel.model";
import { app } from "../../app";
import request from "supertest";

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

const testRouteHandler = (path: string) => async () => {
  const response = await request(app)
    .get(path)
    .set("Cookie", await global.signin());
  expect(response.status).toBe(200);
};

// helper function to test that a route handler is only accessible if the user is signed in
const testRequiresAuth = (path: string) => async () => {
  await request(app).get(path).expect(401);
};

// helper function to test that a route handler returns 401 when the cookie is tampered or invalid
const testInvalidCookie = (path: string) => async () => {
  await request(app).get(path).set("Cookie", "fsadfsdfsadfsa").expect(401);
};

// helper function to test that a route handler returns a status other than 401 if the user is signed in
const testSignedInUser = (path: string) => async () => {
  const response = await request(app)
    .get(path)
    .set("Cookie", await global.signin());
  expect(response.status).not.toEqual(401);
};

export {
  validPersonnel,
  testInvalidCookie,
  testRequiresAuth,
  testRouteHandler,
  testSignedInUser,
};
