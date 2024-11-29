"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_error_1 = require("./custom-error");
/**
 * An error that is thrown when the requested route is not found.
 *
 * This error typically occurs when the user tries to access a route that does not exist or when the user does not have permission to access the route.
 *
 * The `NotFoundError` class extends the `CustomError` class.
 * The `statusCode` property is set to 404, which is the HTTP status code for "Not Found".
 */
class NotFoundError extends custom_error_1.CustomError {
    constructor() {
        super("Route not found");
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    /**
     * Serializes the error into an array of objects, where each object represents a single error message.
     *
     * @returns An array of objects, where each object represents a single error message.
     */
    serializeErrors() {
        return [{ message: "Not Found" }];
    }
}
exports.NotFoundError = NotFoundError;
