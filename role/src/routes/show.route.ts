import express, { Request, Response } from "express";
import { NotFoundError } from "@gams/utility";
import { Role } from "../models/role.model";

const router = express.Router();

router.get("/api/roles/:id", async (req: Request, res: Response) => {
  /**
   * Checks if the user is authenticated. If the user is not authenticated, the router returns a 401 Unauthorized response.
   */
  if (!req.currentUser) {
    return res.status(401).send({ message: "Not Authorized" });
  }

  const role = await Role.findById(req.params.id);

  if (!role) {
    throw new NotFoundError();
  }

  res.send(role);
});

export { router as showRolesRouter };
