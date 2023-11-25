import express, { NextFunction, Request, Response } from "express";
import {
  AjvValidator,
  RequestValidationError,
  NotFoundError,
} from "@gams/utility";

import { Role } from "../models/role.model";
import { roleSchema, RoleType } from "./ajv/ajv-schemas";
import { natsConnector } from "../nats-connector";
import { RoleUpdatedPublisher } from "../helpers/events/role-updated-publisher";

const router = express.Router();

router.put(
  "/api/roles/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
     */
    if (!req.currentUser) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const { nid, pid, name, lastname, department } = req.body;

    const existingRole = await Role.findById(req.params.id);
    if (!existingRole) {
      return next(new NotFoundError());
    }

    /**
     * Validates the request body using Ajv. If there are any validation errors, the router throws a RequestValidationError.
     */
    const validator = new AjvValidator<RoleType>(roleSchema);
    const validationErrors = await validator.validateRequest(req.body, [
      "email",
      "password",
    ]);
    if (validationErrors) {
      return next(new RequestValidationError(validationErrors));
    }

    /**
     * updates the Role by values from req.body
     */
    existingRole.set({
      nid,
      pid,
      name,
      lastname,
      department,
    });
    await existingRole.save();

    /**
     * Publishes a PersonnelCreatedEvent to NATS.
     */
    new RoleUpdatedPublisher(natsConnector.client).publish({
      name: existingRole.name,
    });

    res.send(existingRole);
  }
);

export { router as updateRoleRouter };
