import express, { NextFunction, Request, Response } from "express";
import {
  AjvValidator,
  RequestValidationError,
  BadRequestError,
} from "@gams/utility";

import { Personnel } from "../models/personnel.model";
import { personnelSchema, PersonnelType } from "./ajv/ajv-schemas";
import { natsConnector } from "../nats-connector";
import { PersonnelCreatedPublisher } from "../helpers/event/personnel-created-publisher";

const router = express.Router();

router.post(
  "/api/personnels",
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
     */
    if (!req.currentUser) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const { nid, pid, name, lastname, department } = req.body;

    const existingPersonnel = await Personnel.findOne({ nid });
    if (existingPersonnel) {
      return next(new BadRequestError("nid in use"));
    }

    /**
     * Validates the request body using Ajv. If there are any validation errors, the router throws a RequestValidationError.
     */
    const validator = new AjvValidator<PersonnelType>(personnelSchema);
    const validationErrors = await validator.validateRequest(req.body, [
      "email",
      "password",
    ]);
    if (validationErrors) {
      return next(new RequestValidationError(validationErrors));
    }

    /**
     * Creates a new Personnel instance and assigns the values from the request body.
     */
    const personnel = Personnel.build({
      nid,
      pid,
      name,
      lastname,
      department,
    });
    await personnel.save();

    /**
     * Publishes a PersonnelCreatedEvent to NATS.
     */
    new PersonnelCreatedPublisher(natsConnector.client).publish({
      pid: personnel.pid,
      nid: personnel.nid,
      name: personnel.name,
      lastname: personnel.lastname,
      department: personnel.department,
    });

    res.status(201).send(personnel);
  }
);

export { router as createPersonnelRouter };
