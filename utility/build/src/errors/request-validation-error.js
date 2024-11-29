"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custom_error_1 = require("./custom-error");
class RequestValidationError extends custom_error_1.CustomError {
    // eslint-disable-line @typescript-eslint/no-implicit-any
    constructor(errors) {
        super("Invalid request parameters");
        this.errors = errors;
        this.statusCode = 400;
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    //return the messages of  validation error in an array fromat
    serializeErrors() {
        return this.errors.map((err) => {
            var _a;
            return {
                message: (((_a = err.instancePath) === null || _a === void 0 ? void 0 : _a.slice(1)) + " " + err.message),
            };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
