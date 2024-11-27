import express, { Request, Response } from "express";
import { Role } from "../models/role.model";

const router = express.Router();

///this route handler is just used for testing
router.get("/api/personnels-roles/", async (req: Request, res: Response) => {
  /**
   * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
   */
  if (!req.currentUser) {
    return res.status(401).send({ message: "Not Authorized" });
  }

  const roles = await Role.find({});
  console.log(`roles=====${roles}`);
  res.send(roles);
});

export { router as listRolesRouter };
