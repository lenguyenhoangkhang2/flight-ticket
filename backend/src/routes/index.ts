import express from "express";
import user from "@/routes/user.routes";
import auth from "@/routes/auth.routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.use(user);
router.use(auth);

export default router;
