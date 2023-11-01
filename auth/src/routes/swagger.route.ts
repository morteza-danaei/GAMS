// Serve the Swagger UI.
import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../../Swagger/signup.swagger.json";

const router = express.Router();

var swaggerOptions = {
  explorer: true,
};

// Enable swagggerUI on /api/users/docs
router.use("/api/users/docs", swaggerUi.serve);
router.get("/api/users/docs", swaggerUi.setup(swaggerDocument, swaggerOptions));

export { router as swaggerRouter };
