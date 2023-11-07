import request, { Test } from "supertest";
import mongoose from "mongoose";

import { PrsnlProps } from "../../models/personnel.model";
import { app } from "../../app";
import { Personnel } from "../../models/personnel.model";
import { personnelSchema } from "../ajv/ajv-schemas";

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

// a type for validPersonnel
type ValidPersonnel = {
  nid: string;
  pid: string;
  name: string;
  lastname: string;
  department: string;
};

const LONG_STRING =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

//helper function to test that a route handler exists
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

/**
 *  gets a property name and a value  and a message
 *  and tests if the error message recieved after updating
 *  the property value of a valid personnel to the new one
 *
 * @param key - The property name
 * @param newValue - The new value
 * @param message - The error message that is exected to recieve
 */
const testInput = async (
  method: "post" | "put" | "delete",
  url: string,
  key: string,
  newValue: string | number | undefined,
  message: string
) => {
  const response = await request(app)
    [method](url)
    .set("Cookie", await global.signin())
    .send(Object.assign({}, validPersonnel, { [key]: newValue }))
    .expect(400);
  expect(response.body.errors[0].message).toBe(message);
};

/**
 * Tests updating a property of an object.
 *
 * @param url The URL of the endpoint to update the object at.
 * @param object The object to update.
 * @param property The property to update.
 * @param newValue The new value for the property.
 * @param model The mongoose model for the object.
 * @returns A promise that resolves when the test is complete.
 *
 * @example
 * await testUpdateProperty("/api/personnels/1234567890", { name: "John Doe" }, "name", "Jane Doe", PersonnelModel);
 */
async function testUpdateProperty<
  T extends Object,
  K extends keyof T,
  L extends T[K],
  D,
  M,
>(
  url: string,
  object: T,
  property: K,
  newValue: L,
  model: mongoose.Model<D, M>
) {
  const updatedObject = { ...object };

  console.log("updated object ========", updatedObject);

  // Update the property
  updatedObject[property] = newValue;

  // Make the request to update the object
  await request(app)
    .put(url)
    .set("Cookie", await global.signin())
    .send(updatedObject)
    .expect(200);

  // Fetch the updated object from the database
  const updatedObjects: T[] = await model.find({});

  // Expect that there is only one updated object
  expect(updatedObjects).toBeDefined();

  expect(updatedObjects.length).toBe(1);

  // Assert that the updated object has the correct property value
  expect(updatedObjects[0][property]).toEqual(newValue);

  // Assert that the other properties of the updated object are still the same
  for (const [key, value] of Object.entries(object)) {
    if (key !== property) {
      expect(updatedObjects[0][key as K]).toEqual(value);
    }
  }
}

/**
 * Tests the validation of personnel provided in the body of  a PUT or POST request to the specified URL.
 *
 * @param url The URL of the endpoint to test.
 * @param method The HTTP method to use for the test.
 */
const validationTest = async (
  url: string,
  method: "put" | "post" | "delete"
) => {
  for (const key of Object.keys(validPersonnel)) {
    const key1: keyof PrsnlProps = key as keyof PrsnlProps;

    // test to see the minLength criteria is followed
    await testInput(
      method,
      url,
      key1,
      "a",
      `${key1.toString()} ${
        personnelSchema.properties[key1].errorMessage.minLength
      }`
    );

    // test to see the maxLength criteria is followed
    await testInput(
      method,
      url,
      key1.toString(),
      LONG_STRING,
      `${key1.toString()} ${
        personnelSchema.properties[key1].errorMessage.maxLength
      }`
    );

    //test to see the type criteria is followed
    await testInput(
      method,
      url,
      key1.toString(),
      1,
      `${key1.toString()} ${personnelSchema.properties[key1].errorMessage.type}`
    );

    //test to see the required criteria os followed
    await testInput(
      method,
      url,
      key1.toString(),
      undefined,
      ` ${personnelSchema.errorMessage.required[key1]}`
    );
  }
};

export {
  validPersonnel,
  ValidPersonnel,
  testInvalidCookie,
  testRequiresAuth,
  testRouteHandler,
  testSignedInUser,
  testInput,
  testUpdateProperty,
  validationTest,
};
