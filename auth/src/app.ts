import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signupRouter } from "./routes/signup.route";
import { NotFoundError } from "@gams/utility";
import { errorHandler } from "@gams/utility";
import { signinRouter } from "./routes/signin.route";
import { currentUserRouter } from "./routes/current-user.route";
import { signoutRouter } from "./routes/signout.route";
import { swaggerRouter } from "./routes/swagger.route";
import { cookieOptions } from "@gams/utility";

const app = express();

app.use(json());
app.set("trust proxy", true);

app.use(cookieSession(cookieOptions));

app.use(swaggerRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
