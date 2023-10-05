import express from "express";
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import { User } from "../models/user";
import { validateRequest } from "../helpers/validator";
import { BadRequestError } from "../errorHandler/errors/bad-request-error";
import { RequestValidationError } from "../errorHandler/errors/request-validation-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const validationErrors = await validateRequest(req, next);

    if (validationErrors) {
      // console.log(`validationError: ${validationError}`);
      return next(new RequestValidationError(validationErrors));
    }
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return next(new BadRequestError("username in use"));
    }

    const user = User.build({ username, password, email } as {
      username: string;
      password: string;
      email: string;
    });
    await user.save();

    // Generate JWT

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
