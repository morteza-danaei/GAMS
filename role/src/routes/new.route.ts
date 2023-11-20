import express, { NextFunction, Request, Response } from "express";
import {
  AjvValidator,
  RequestValidationError,
  BadRequestError,
} from "@gams/utility";

import { Role } from "../models/role.model";
import { roleSchema, RoleType } from "./ajv/ajv-schemas";
import { natsConnector } from "../nats-connector";
import { RoleCreatedPublisher } from "../helpers/events/role-created-publisher";

const router = express.Router();

router.post(
  "/api/roles",
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
     */
    if (!req.currentUser) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const { name } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return next(new BadRequestError("Role already exists"));
    }

    console.log("before Validation");

    /**
     * Validates the request body using Ajv. If there are any validation errors, the router throws a RequestValidationError.
     */
    const validator = new AjvValidator<RoleType>(roleSchema);
    const validationErrors = await validator.validateRequest(req.body);
    if (validationErrors) {
      return next(new RequestValidationError(validationErrors));
    }
    console.log("after Validation");

    /**
     * Creates a new Role instance and assigns the values from the request body.
     */
    const role = Role.build({
      name,
    });
    await role.save();

    /**
     * Publishes a PersonnelCreatedEvent to NATS.
     */
    new RoleCreatedPublisher(natsConnector.client).publish({
      name: role.name,
    });

    res.status(201).send(role);
  }
);

export { router as createRoleRouter };
