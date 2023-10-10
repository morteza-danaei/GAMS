import addFormats from "ajv-formats";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";

import { Request, Response, NextFunction } from "express";

class AjvValidator<T extends Object> {
  constructor(private schema: T) {}

  /**
  * A function of for user validation using ajv
 
  * @param req - The request object
  * @returns  undefined if there is no  requset validation error 
  *           the error array if there are some validation errors
  *            
  */
  validateRequest(req: Request) {
    const ajv = new Ajv({ allErrors: true, $data: true }); // options can be passed, e.g. {allErrors: true}
    addFormats(ajv, ["password", "email"]);
    ajvErrors(ajv);
    //defining  schema in json schema format
    const validate = ajv.compile(this.schema);

    const valid = validate(req);
    if (!valid) {
      return validate.errors;
    }

    return undefined;
  }
}

export { AjvValidator };
