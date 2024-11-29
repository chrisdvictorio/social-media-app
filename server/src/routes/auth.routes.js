import express from "express";

import authController from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protectRoute, authController.getMe);

export default router;