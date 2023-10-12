import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "@gams/utility";
import { currentUser } from "@gams/utility";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res, next) => {
  if (req.currentUser == null) {
    return next(new BadRequestError("There is sth wrong with the cookie"));
  } else {
    res.send({ currentUser: req.currentUser || null });
  }
});

export { router as currentUserRouter };
