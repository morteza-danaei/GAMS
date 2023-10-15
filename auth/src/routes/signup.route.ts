import express from "express";
import { Request, Response, NextFunction } from "express";

import { User } from "../models/user.model";
import {
  AjvValidator,
  BadRequestError,
  RequestValidationError,
} from "@gams/utility";
import { SignupType, signupSchema } from "./ajv/ajv-schemas";
import { jwtSign } from "../helpers/jwt.helper";

const router = express.Router();

router.post(
  "/api/users/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });

    //This code segment validates the body and find possible errors
    const validator = new AjvValidator<SignupType>(signupSchema);
    const validationErrors = await validator.validateRequest(req.body, [
      "email",
      "password",
    ]);

    if (validationErrors) {
      return next(new RequestValidationError(validationErrors));
    }

    if (existingUser) {
      return next(new BadRequestError("username in use"));
    }

    const user = User.build({ username, password, email } as {
      username: string;
      password: string;
      email: string;
    });

    await user.save();

    req = jwtSign(req, user);

    res.status(201).send(user);
  }
);

export { router as signupRouter };
