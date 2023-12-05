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
import { createRoleRouter } from "./routes/new.route";
import { listRolesRouter } from "./routes/list.route";
import { showRolesRouter } from "./routes/show.route";
import { updateRoleRouter } from "./routes/update.route";
import { deleteRolesRouter } from "./routes/delete.route";
import { swaggerRouter } from "./routes/swagger.route";

const app = express();

app.use(json());
app.set("trust proxy", true);

app.use(cookieSession(cookieOptions));
app.use(cookieParser());

/**
 * A middleware that adds currentuser to the req obj if
 * the user is signed in
 */
app.use(currentUser);

// TODO: add a middleware to check the role of the user

app.use(createRoleRouter);
app.use(listRolesRouter);
app.use(showRolesRouter);
app.use(updateRoleRouter);
app.use(deleteRolesRouter);
app.use(swaggerRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

/**
 * An error handler for handling all erorrs occure in middlewares
 */
app.use(errorHandler);

export { app };
