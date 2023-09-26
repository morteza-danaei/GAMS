import { Request, Response, NextFunction } from "express";
import Joi from "joi";

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

export { validateRequest };
