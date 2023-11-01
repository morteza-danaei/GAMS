import jwt from "jsonwebtoken";
import { Request } from "express";

import { UserDoc } from "../models/user.model";

/**
 * Signs a JWT token for the given user and stores it on the session object.
 *
 * @param req The Express request object.
 * @param user The user object.
 * @returns The Express request object with the `session` object updated.
 */
export const jwtSign = (req: Request, user: UserDoc): Request => {
  const userJwt = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_KEY!
  );
  console.log(`jwtSign ${userJwt}`);

  // Store jwt on session object
  req.session = {
    jwt: userJwt,
  };
  return req;
};
