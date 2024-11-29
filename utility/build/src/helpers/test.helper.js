"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringAjvValidationTest = exports.testInvalidCookie = exports.testSignedInUser = exports.testRequiresAuth = exports.testRouteHandler = exports.testUpdateProperty = exports.testInput = void 0;
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signin = (jwtKey) => __awaiter(void 0, void 0, void 0, function* () {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        email: "test@test.com",
    };
    // Create the JWT!
    const token = jsonwebtoken_1.default.sign(payload, jwtKey);
    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");
    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
});
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
const testRouteHandler = (path, method, status, jwtKey, validObject, expect, app) => () => __awaiter(void 0, void 0, void 0, function* () {
    // Create a base request with authentication and method-specific handling
    const baseRequest = (0, supertest_1.default)(app)[method](path)
        .set("Cookie", yield signin(jwtKey));
    // Make the HTTP request with or without sending a valid object
    const response = method !== "get"
        ? yield baseRequest.send(validObject)
        : yield baseRequest;
    // Assert that the response status matches the expected status
    expect(response.status).toBe(status);
});
exports.testRouteHandler = testRouteHandler;
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
const testRequiresAuth = (path, method, status, app) => () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app)[method](path).expect(status);
});
exports.testRequiresAuth = testRequiresAuth;
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
const testInvalidCookie = (path, method, status, app) => () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app)[method](path)
        .set("Cookie", "fsadfsdfsadfsa")
        .expect(status);
});
exports.testInvalidCookie = testInvalidCookie;
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
const testSignedInUser = (path, method, status, jwtKey, app) => () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app)[method](path)
        .set("Cookie", yield signin(jwtKey));
    expect(response.status).not.toEqual(status);
});
exports.testSignedInUser = testSignedInUser;
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
const testInput = (method, url, key, newValue, app, jwtKey, validObject) => __awaiter(void 0, void 0, void 0, function* () {
    // Make the HTTP request using Supertest and await the response
    const response = yield (0, supertest_1.default)(app)[method](url)
        .set("Cookie", yield signin(jwtKey))
        .send(Object.assign({}, validObject, { [key]: newValue }))
        .expect(400);
    return response;
});
exports.testInput = testInput;
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
function testUpdateProperty(url, object, property, newValue, model, app, jwtKey, expect) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedObject = Object.assign({}, object);
        console.log("updated object ========", updatedObject);
        // Update the property
        updatedObject[property] = newValue;
        // Make the request to update the object
        yield (0, supertest_1.default)(app)
            .put(url)
            .set("Cookie", yield signin(jwtKey))
            .send(updatedObject)
            .expect(200);
        // Fetch the updated object from the database
        const updatedObjects = yield model.find({});
        // Expect that there is only one updated object
        expect(updatedObjects).toBeDefined();
        expect(updatedObjects.length).toBe(1);
        // Assert that the updated object has the correct property value
        expect(updatedObjects[0][property]).toEqual(newValue);
        // Assert that the other properties of the updated object are still the same
        for (const [key, value] of Object.entries(object)) {
            if (key !== property) {
                expect(updatedObjects[0][key]).toEqual(value);
            }
        }
    });
}
exports.testUpdateProperty = testUpdateProperty;
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
const stringAjvValidationTest = (url, method, criteria, validObject, app, expect, objectSchema) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < criteria.length; i++) {
        for (const key of Object.keys(validObject)) {
            const key1 = key;
            // Perform the test using the testInput utility
            const response = yield testInput(method, url, key1, criteria[i][0] === "required" ? undefined : criteria[i][1], app, process.env.JWT_KEY, validObject);
            // Check if the received error message matches the expected format
            expect(response.body.errors[0].message).toBe(criteria[i][0] === "required"
                ? ` ${objectSchema.errorMessage.required[key1]}`
                : `${key1.toString()} ${objectSchema.properties[key1].errorMessage[criteria[i][0]]}`);
        }
    }
});
exports.stringAjvValidationTest = stringAjvValidationTest;
