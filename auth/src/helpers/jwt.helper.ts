import jwt from "jsonwebtoken";
import { Request } from "express";

import { UserDoc } from "../models/user.model";

export const jwtSign = (req: Request, user: UserDoc): Request => {
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
  return req;
};
