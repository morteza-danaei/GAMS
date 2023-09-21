import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signupRouter } from "./routes/signup";

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

app.all("*", async (req, res) => {
  //TODO: create a NotFoundError class and handle it
  //TODO: inside error handler middleware
  throw new Error("The path not found");
});

export { app };
