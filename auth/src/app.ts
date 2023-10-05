import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signupRouter } from "./routes/signup";
import { NotFoundError } from "./errorHandler/errors/not-found-error";
import { errorHandler } from "./errorHandler/error-handler";
import { signinRouter } from "./routes/signin";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(signupRouter);
app.use(signinRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
