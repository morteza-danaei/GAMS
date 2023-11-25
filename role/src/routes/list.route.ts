import express, { Request, Response } from "express";
import { Role } from "../models/role.model";

const router = express.Router();

router.get("/api/roles", async (req: Request, res: Response) => {
  /**
   * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
   */
  if (!req.currentUser) {
    return res.status(401).send({ message: "Not Authorized" });
  }

  const roles = await Role.find({});

  res.send(roles);
});

export { router as listRolesRouter };
