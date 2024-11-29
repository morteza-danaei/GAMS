"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjvValidator = void 0;
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
class AjvValidator {
    constructor(schema) {
        this.schema = schema;
    }
    /**
    * A function of for user validation using ajv
   
    * @param req - The request object
    * @returns  undefined if there is no  requset validation error
    *           the error array if there are some validation errors
    *
    */
    validateRequest(req, formats) {
        const ajv = new ajv_1.default({ allErrors: true, $data: true }); // options can be passed, e.g. {allErrors: true}
        if (formats)
            (0, ajv_formats_1.default)(ajv, formats);
        (0, ajv_errors_1.default)(ajv);
        //defining  schema in json schema format
        const validate = ajv.compile(this.schema);
        const valid = validate(req);
        if (!valid) {
            return validate.errors;
        }
        return undefined;
    }
}
exports.AjvValidator = AjvValidator;
