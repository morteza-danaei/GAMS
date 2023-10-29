import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import {
  cookieOptions,
  NotFoundError,
  errorHandler,
  currentUser,
} from "@gams/utility";
import { createPersonnelRouter } from "./routes/new.route";

const app = express();

app.use(json());
app.set("trust proxy", true);

app.use(cookieSession(cookieOptions));
app.use(cookieParser());

// This is a middleware that adds currentuser to the req obj if
// the user is signed in
app.use(currentUser);

// TODO: add a middleware to check the role of the user
app.use(createPersonnelRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

//This is an error handler for handling all erorrs
// occured in middlewares
app.use(errorHandler);

export { app };
