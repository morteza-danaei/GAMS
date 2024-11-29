import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// a middleware that extract the user payload from jwt token
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session!.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session!.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    return next(err);
  }

  next();
};
