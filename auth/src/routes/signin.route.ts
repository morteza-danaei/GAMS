import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  AjvValidator,
  BadRequestError,
  RequestValidationError,
} from "@gams/utility";
import { Password } from "../helpers/password.helper";
import { User } from "../models/user.model";
import { SigninType, signinSchema } from "./ajv/ajv-schemas";
import { jwtSign } from "../helpers/jwt.helper";

const router = express.Router();

router.post(
  "/api/users/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    let passwordsMatch = false;
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser)
      passwordsMatch = await Password.compare(existingUser!.password, password);

    //This code segment validates the body and find possible errors
    const validator = new AjvValidator<SigninType>(signinSchema);
    const validationErrors = await validator.validateRequest(req.body, [
      "password",
      "email",
    ]);

    if (validationErrors) {
      return next(new RequestValidationError(validationErrors));
    }

    if (!existingUser) {
      return next(new BadRequestError("Invalid credentials"));
    }

    if (!passwordsMatch) {
      return next(new BadRequestError("Invalid credentials"));
    }

    req = jwtSign(req, existingUser);

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
