import express, { NextFunction, Request, Response } from "express";
import {
  AjvValidator,
  RequestValidationError,
  BadRequestError,
} from "@gams/utility";

import { Personnel } from "../models/personnel.model";
import { personnelSchema, PersonnelType } from "./ajv/ajv-schemas";

const router = express.Router();

router.post(
  "/api/personnels",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const { nid, pid, name, lastname, department } = req.body;

    const existingPersonnel = await Personnel.findOne({ nid });

    if (existingPersonnel) {
      return next(new BadRequestError("nid in use"));
    }

    //This code segment validates the body and find possible errors
    const validator = new AjvValidator<PersonnelType>(personnelSchema);
    const validationErrors = await validator.validateRequest(req.body, [
      "email",
      "password",
    ]);

    if (validationErrors) {
      return next(new RequestValidationError(validationErrors));
    }

    const personnel = Personnel.build({
      nid,
      pid,
      name,
      lastname,
      department,
    });

    await personnel.save();

    res.status(201).send(personnel);
  }
);

export { router as createPersonnelRouter };
