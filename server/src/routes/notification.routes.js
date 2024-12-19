import express from "express";

import notificationController from "../controllers/notification.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, notificationController.getAllNotifications);
router.patch(
  "/:notificationId",
  protectRoute,
  notificationController.readNotification
);
router.delete(
  "/:senderId/delete",
  protectRoute,
  notificationController.deleteNotification
);

router.get(
  "/count",
  protectRoute,
  notificationController.getReadNotificationCount
);

export default router;
