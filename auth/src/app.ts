import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signupRouter } from "./routes/signup";
import { NotFoundError } from "./errorHandler/errors/not-found-error";
import { errorHandler } from "./errorHandler/error-handler";
import { signinRouter } from "./routes/signin";
import { currentUserRouter } from "./routes/current-user";

const app = express();
app.use(json());
app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: process.env.NODE_ENV !== "test",
    keys: [process.env.COOKIE_KEY1!, process.env.COOKIE_KEY2!],
    secure: process.env.NODE_ENV !== "test",
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
