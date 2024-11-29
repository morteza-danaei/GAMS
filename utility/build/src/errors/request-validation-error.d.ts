import { CustomError } from "./custom-error";
export declare class RequestValidationError extends CustomError {
    errors: any[];
    statusCode: number;
    constructor(errors: any[]);
    serializeErrors(): {
        message: string;
    }[];
}
