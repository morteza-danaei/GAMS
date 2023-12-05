import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../../swagger/role.swagger.json";

const router = express.Router();

var swaggerOptions = {
  explorer: true,
};

// Enable swagggerUI on /api/docs/roles
router.use("/api/docs/roles", swaggerUi.serve);
router.get("/api/docs/roles", swaggerUi.setup(swaggerDocument, swaggerOptions));

export { router as swaggerRouter };
