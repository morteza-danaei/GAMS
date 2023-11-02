import express, { Request, Response } from "express";
import { NotFoundError } from "@gams/utility";
import { Personnel } from "../models/personnel.model";

const router = express.Router();

router.get("/api/personnels/:id", async (req: Request, res: Response) => {
  const personnel = await Personnel.findById(req.params.id);

  if (!personnel) {
    throw new NotFoundError();
  }

  res.send(personnel);
});

export { router as showPersonnelRouter };
