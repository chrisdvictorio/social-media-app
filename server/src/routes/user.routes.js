import express from "express";

import userController from "../controllers/user.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, userController.getAllUsers);
router.get("/random", protectRoute, userController.getRandomUsers);
router.get("/search", protectRoute, userController.searchUsers);
router.get("/:username", protectRoute, userController.getSingleUser);
router.patch("/update", protectRoute, userController.updateUser);

export default router;
