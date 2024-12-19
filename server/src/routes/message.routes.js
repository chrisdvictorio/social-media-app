import express from "express";

import messageController from "../controllers/message.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:userId", protectRoute, messageController.getSingleConversation);
router.post("/:userId", protectRoute, messageController.createMessage);

router.get("/", protectRoute, messageController.getAllConversation);

export default router;
