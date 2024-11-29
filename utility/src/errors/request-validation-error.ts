import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  // eslint-disable-line @typescript-eslint/no-implicit-any
  constructor(public errors: any[]) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  //return the messages of  validation error in an array fromat
  serializeErrors() {
    return this.errors.map((err) => {
      return {
        message: (err.instancePath?.slice(1) + " " + err.message!) as string,
      };
    });
  }
}
