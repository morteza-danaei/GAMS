import { CustomError } from "./custom-error";

/**
 * An error that is thrown when the requested route is not found.
 *
 * This error typically occurs when the user tries to access a route that does not exist or when the user does not have permission to access the route.
 *
 * The `NotFoundError` class extends the `CustomError` class.
 * The `statusCode` property is set to 404, which is the HTTP status code for "Not Found".
 */
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route not found");

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
