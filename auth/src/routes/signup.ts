import express from "express";
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import { User } from "../models/user";
import { validateRequest } from "../helpers/validator";
import { BadRequestError } from "../errorHandler/errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new BadRequestError("Email in use"));
    }

    const user = User.build({ email, password });
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
