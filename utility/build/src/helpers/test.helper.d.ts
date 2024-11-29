import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
type ExpectType = <T>(value: T) => any;
interface ValidObject {
    [key: string]: any;
}
/**
 * Tests a route handler by making an HTTP request with a specified path, method, and
 * status expectation. The test includes authentication using a signed-in user's JSON
 * Web Token (JWT) and optionally sends a valid object with the request body.
 *
 * @param path - The URL endpoint for the HTTP request.
 * @param method - The HTTP method to be tested (post, put, delete, or get).
 * @param status - The expected HTTP response status.
 * @param jwtKey - The JSON Web Token (JWT) key for authentication.
 * @param validObject - An optional valid object to be sent with the request body.
 * @param expect - The Jest expect function for assertions.
 * @param app - The Express application instance.
 *
 * @returns {Promise<void>} - A promise that resolves after the test completes.
 *
 * @throws {Error} - Throws an error if the assertion fails.
 */
declare const testRouteHandler: (path: string, method: "post" | "put" | "delete" | "get", status: number, jwtKey: string, validObject: ValidObject, expect: ExpectType, app: Express) => () => Promise<void>;
/**
 * Tests an HTTP request that requires authentication by making an HTTP request
 * without including a valid cookie for authentication and asserting that the
 * response status matches the expected status.
 *
 * @param path - The URL endpoint for the HTTP request.
 * @param method - The HTTP method to be tested (post, put, delete, or get).
 * @param status - The expected HTTP response status.
 * @param app - The Express application instance.
 *
 * @returns {Promise<void>} - A promise that resolves after the test completes.
 *
 * @throws {Error} - Throws an error if the assertion fails.
 */
declare const testRequiresAuth: (path: string, method: "post" | "put" | "delete" | "get", status: number, app: Express) => () => Promise<void>;
/**
 * Tests an HTTP request with an invalid cookie by making an HTTP request with
 * an invalid cookie value and asserting that the response status matches the
 * expected status.
 *
 * @param path - The URL endpoint for the HTTP request.
 * @param method - The HTTP method to be tested (post, put, delete, or get).
 * @param status - The expected HTTP response status.
 * @param app - The Express application instance.
 *
 * @returns {Promise<void>} - A promise that resolves after the test completes.
 *
 * @throws {Error} - Throws an error if the assertion fails.
 */
declare const testInvalidCookie: (path: string, method: "post" | "put" | "delete" | "get", status: number, app: Express) => () => Promise<void>;
/**
 * Tests an authenticated user's access to a specific route by making an HTTP request
 * with a signed-in user's JSON Web Token (JWT) and asserting that the response status
 * does not match the expected status.
 *
 * @param path - The URL endpoint for the HTTP request.
 * @param method - The HTTP method to be tested (post, put, delete, or get).
 * @param status - The expected HTTP response status that the test should not match.
 * @param jwtKey - The JSON Web Token (JWT) key for authentication.
 * @param app - The Express application instance.
 *
 * @returns {Promise<void>} - A promise that resolves after the test completes.
 *
 * @throws {Error} - Throws an error if the assertion fails.
 */
declare const testSignedInUser: (path: string, method: "post" | "put" | "delete" | "get", status: number, jwtKey: string, app: Express) => () => Promise<void>;
/**
 * Tests the input by making an HTTP request to a specified URL with a modified property value.
 *
 * @param method - The HTTP method to be tested (post, put, delete, or get).
 * @param url - The URL endpoint for the HTTP request.
 * @param key - The property name to be updated in the valid object.
 * @param newValue - The new value for the specified property.
 * @param app - The Express application instance.
 * @param jwtKey - The JSON Web Token (JWT) key for authentication.
 * @param validObject - An object representing the valid data for the request.
 *
 * @returns {Promise<request.Response>} - A promise that resolves with the Response type object from the supertest request.
 */
declare const testInput: (method: "post" | "put" | "delete" | "get", url: string, key: string, newValue: string | number | undefined, app: Express, jwtKey: string, validObject: Object) => Promise<request.Response>;
/**
 * Tests the update of a property in an object by making an HTTP request to update the object,
 * and then fetching the updated object from the database. It also performs assertions to ensure
 * the update was successful and that other properties remain unchanged.
 *
 * @param url - The URL endpoint for the update request.
 * @param object - The original object to be updated.
 * @param property - The property name to be updated in the object.
 * @param newValue - The new value for the specified property.
 * @param model - The Mongoose model representing the type of object being updated.
 * @param app - The Express application instance.
 * @param jwtKey - The JSON Web Token (JWT) key for authentication.
 * @param expect - The Jest expect function for assertions.
 *
 * @returns {Promise<T[]>} - A promise that resolves with an array of updated objects fetched from the database.
 *
 * @throws {Error} - Throws an error if the update fails or if the assertions do not pass.
 */
declare function testUpdateProperty<T extends Object, K extends keyof T, L extends T[K], D, M>(url: string, object: T, property: K, newValue: L, model: mongoose.Model<D, M>, app: Express, jwtKey: string, expect: ExpectType): Promise<void>;
/**
 * Performs string validation tests using Ajv for a given URL, HTTP method, and validation criteria.
 *
 * @param url - The URL endpoint for the test.
 * @param method - The HTTP method to be tested (put, post, delete, or get).
 * @param criteria - An array of arrays representing validation scenarios.
 *                   Each inner array should have two elements: the validation criterion
 *                   (e.g., "minLength", "maxLength", "type", "required") and the associated value.
 * @param validObject - An object representing the valid data to be used for testing.
 * @param app - The Express application instance.
 * @param expect - The Jest expect function for assertions.
 * @param objectSchema - The schema definition for the valid object, including error messages.
 *
 * @returns {Promise<void>} - A promise that resolves after all tests have been completed.
 */
declare const stringAjvValidationTest: (url: string, method: "put" | "post" | "delete" | "get", criteria: Array<Array<string | number>>, validObject: ValidObject, app: Express, expect: ExpectType, objectSchema: ValidObject) => Promise<void>;
export { testInput, testUpdateProperty, testRouteHandler, testRequiresAuth, testSignedInUser, testInvalidCookie, stringAjvValidationTest, };
