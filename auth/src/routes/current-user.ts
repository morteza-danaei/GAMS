import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errorHandler/errors/bad-request-error";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// a middleware to extract the current user
// from jwt token
const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res, next) => {
  if (req.currentUser == null) {
    return next(new BadRequestError("There is sth wrong with the cookie"));
  } else {
    res.send({ currentUser: req.currentUser || null });
  }
});

export { router as currentUserRouter };
