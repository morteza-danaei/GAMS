const addFormats = require("ajv-formats");
const Ajv = require("ajv");

import { Request, Response, NextFunction } from "express";

//TODO: define an abstract class for validator and
//ToDO: two subcalsses for signup validator and signin validator

/**
 * A function of for user validation using ajv

 * @param req - The request object
 * @param next - The next function
 * @returns  undefined if there is no  requset validation error 
 *           the error array if there are some validation errors
 *            
 */
const validateRequest = async (req: Request, next: NextFunction) => {
  const ajv = new Ajv({ allErrors: true, async: true, $data: true }); // options can be passed, e.g. {allErrors: true}
  addFormats(ajv, ["password", "email"]);

  //defining  schema in json schema format
  const schema = {
    type: "object",
    properties: {
      username: { type: "string", minimum: 4, maximum: 20 },
      password: {
        type: "string",
        format: "password",
      },

      //set this field equal to password by using a json relative pointer
      repeat_password: { type: "string", const: { $data: "1/password" } },
      email: { type: "string", format: "email" },
    },
    required: ["username", "password", "email", "repeat_password"],
    additionalProperties: false,
  };

  const validate = ajv.compile(schema);

  const valid = await validate(req.body);
  if (!valid) {
    return validate.errors;
  }
  return undefined;
};

export { validateRequest };
