/**
 * An abstract class that represents a custom error.
 *
 * Subclasses of the `CustomError` class must implement the `statusCode` and `serializeErrors()` methods.
 * The `statusCode` method should return the HTTP status code associated with the error.
 * The `serializeErrors()` method should return an array of objects, where each object represents a single error message.
 * The object should have a `message` property, which is the error message, and a `field` property, which is the field that the error is related to (optional).
 * The `CustomError` class can be used to create custom errors that are specific to your application.
 * For example, you could create a `ValidationError` class that extends the `CustomError` class and is used to represent validation errors.
 */
export abstract class CustomError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  abstract statusCode: number;

  /**
   * Constructs a new `CustomError` instance.
   *
   * @param message The error message.
   */
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * Serializes the error into an array of objects, where each object represents a single error message.
   *
   * @returns An array of objects, where each object represents a single error message.
   */
  abstract serializeErrors(): { message: string; field?: string }[];
}
