// Serve the Swagger UI.
import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../../swagger/personnel.swagger.json";

const router = express.Router();

var swaggerOptions = {
  explorer: true,
};

// Enable swagggerUI on /api/docs/personnels
router.use("/api/docs/personnels", swaggerUi.serve);
router.get(
  "/api/docs/personnels",
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

export { router as swaggerRouter };
