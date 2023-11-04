import express, { Request, Response } from "express";
import { Personnel } from "../models/personnel.model";

const router = express.Router();

router.get("/api/personnels", async (req: Request, res: Response) => {
  /**
   * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
   */
  if (!req.currentUser) {
    return res.status(401).send({ message: "Not Authorized" });
  }

  const personnels = await Personnel.find({});

  res.send(personnels);
});

export { router as listPersonnelRouter };
