import express from "express";
import { createDelayMiddleware } from "../middleware/delayResponse.js";

export const createMockRouter = (controller, mockService) => {
  const router = express.Router();
  const delayMiddleware = createDelayMiddleware(mockService);

  router.post("/config", controller.updateConfig.bind(controller));
  router.get("/routes", controller.getRoutes.bind(controller));
  router.get("/routes/*", controller.getRouteConfig.bind(controller));
  router.delete("/routes/*", controller.deleteRoute.bind(controller));

  router.get(
    "*",
    delayMiddleware,
    controller.handleMockRequest.bind(controller)
  );

  return router;
};
