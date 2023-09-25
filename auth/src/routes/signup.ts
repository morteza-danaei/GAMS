import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import { User } from "../models/user";
import { BadRequestError } from "../errorHandler/errors/bad-request-error";

const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(6).max(30).required(),

    password: Joi.string().min(6).required(),

    repeat_password: Joi.ref("password"),

    email: Joi.string().email(),
  });

  try {
    const value = await schema.validateAsync(req.body);
  } catch (err) {
    //TODO: design an error handler system that have different classes for errors
    //TODO: and here  we can pass errors.array() to be handled
    //TODO: design a ValidationError class
    console.log(err);
  }
  next();
};

const router = express.Router();

router.post(
  "/api/users/signup",
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      next(new BadRequestError("Email in use"));
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
