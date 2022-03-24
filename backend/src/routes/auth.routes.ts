import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from "@/controller/auth.controller";
import validateResource from "@/middleware/validateResourse";
import { createSessionSchema } from "@/schema/auth.schema";
import express from "express";

const router = express.Router();

router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

router.post("/api/sessions/refresh", refreshAccessTokenHandler);

export default router;
