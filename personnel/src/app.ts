import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { cookieOptions, NotFoundError, errorHandler } from "@gams/utility";

const app = express();

app.use(json());
app.set("trust proxy", true);

app.use(cookieSession(cookieOptions));

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// An error handler for handling all erorrs
// occured in middlewares
app.use(errorHandler);

export { app };
