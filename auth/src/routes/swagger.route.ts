// Serve the Swagger UI.
import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../../Swagger/auth.swagger.json";

const router = express.Router();

var swaggerOptions = {
  explorer: true,
};

// Enable swagggerUI on /api/docs/users
router.use("/api/docs/users", swaggerUi.serve);
router.get("/api/docs/users", swaggerUi.setup(swaggerDocument, swaggerOptions));

export { router as swaggerRouter };
