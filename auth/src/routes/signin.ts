import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { validateRequest } from "../helpers/validator";
import { BadRequestError } from "../errorHandler/errors/bad-request-error";
import { RequestValidationError } from "../errorHandler/errors/request-validation-error";
import { Password } from "../helpers/password";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    // const validationErrors = await validateRequest(req, next);

    // if (validationErrors) {
    //   // console.log(`validationError: ${validationError}`);
    //   return next(new RequestValidationError(validationErrors));
    // }
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return next(new BadRequestError("user invalid credentials"));
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      return next(new BadRequestError("pass Invalid credentials"));
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
