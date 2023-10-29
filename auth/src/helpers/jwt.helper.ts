import jwt from "jsonwebtoken";
import { Request } from "express";

import { UserDoc } from "../models/user.model";

export const jwtSign = (req: Request, user: UserDoc): Request => {
  const userJwt = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_KEY!
  );
  console.log(`jwtSign ${userJwt}`);

  // Store it on session object
  req.session = {
    jwt: userJwt,
  };
  return req;
};
