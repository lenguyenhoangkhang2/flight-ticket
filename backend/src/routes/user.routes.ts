import {
  createUseSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "@/schema/user.schema";
import express from "express";
import validateResource from "@/middleware/validateResourse";
import {
  createUserHandler,
  forgotPassswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "@/controller/user.controller";
import requireUser from "@/middleware/requireUser";

const router = express.Router();

router.post("/api/users", validateResource(createUseSchema), createUserHandler);

router.get(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post(
  "/api/users/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPassswordHandler
);

router.post(
  "/api/users/reset-password/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default router;
