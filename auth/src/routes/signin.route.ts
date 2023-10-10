import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AjvValidator } from "./ajv/ajv-validator";
import { BadRequestError } from "../errorHandler/errors/bad-request-error";
import { RequestValidationError } from "../errorHandler/errors/request-validation-error";
import { Password } from "../helpers/password";
import { User } from "../models/user";
import { SigninType, signinSchema } from "./ajv/ajv-schemas";

const router = express.Router();

router.post(
  "/api/users/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const validator = new AjvValidator<SigninType>(signinSchema);
    const validationErrors = await validator.validateRequest(req.body);

    if (validationErrors) {
      return next(new RequestValidationError(validationErrors));
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return next(new BadRequestError("Invalid credentials"));
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      return next(new BadRequestError("Invalid credentials"));
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
