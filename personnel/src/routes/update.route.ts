import express, { NextFunction, Request, Response } from "express";
import {
  AjvValidator,
  RequestValidationError,
  BadRequestError,
  NotFoundError,
} from "@gams/utility";

import { Personnel } from "../models/personnel.model";
import { personnelSchema, PersonnelType } from "./ajv/ajv-schemas";
import { natsConnector } from "../nats-connector";
import { PersonnelUpdatedPublisher } from "../helpers/event/personnel-updated-publisher";

const router = express.Router();

router.put(
  "/api/personnels/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
     */
    if (!req.currentUser) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const { nid, pid, name, lastname, department } = req.body;

    const existingPersonnel = await Personnel.findById(req.params.id);
    if (!existingPersonnel) {
      return next(new NotFoundError());
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
     * updates the Personnel by values from req.body
     */
    existingPersonnel.set({
      nid,
      pid,
      name,
      lastname,
      department,
    });
    await existingPersonnel.save();

    /**
     * Publishes a PersonnelCreatedEvent to NATS.
     */
    new PersonnelUpdatedPublisher(natsConnector.client).publish({
      pid: existingPersonnel.pid,
      nid: existingPersonnel.nid,
      name: existingPersonnel.name,
      lastname: existingPersonnel.lastname,
      department: existingPersonnel.department,
    });

    res.status(201).send(existingPersonnel);
  }
);

export { router as updatePersonnelRouter };
