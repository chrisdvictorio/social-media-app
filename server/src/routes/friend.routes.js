import express from "express";

import friendController from "../controllers/friend.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:userId", protectRoute, friendController.getAllUserFriends);
router.get(
  "/requests/received",
  protectRoute,
  friendController.getAllFriendRequests
);
router.get("/requests/sent", protectRoute, friendController.getAllSentRequests);
router.get(
  "/requests/:userId",
  protectRoute,
  friendController.getSingleFriendRequest
);
router.post(
  "/requests/:userId",
  protectRoute,
  friendController.sendFriendRequest
);
router.post(
  "/requests/:friendRequestId/accept",
  protectRoute,
  friendController.acceptFriendRequest
);
router.delete(
  "/requests/:friendRequestId/decline",
  protectRoute,
  friendController.declineFriendRequest
);
router.delete(
  "/requests/:friendRequestId/cancel",
  protectRoute,
  friendController.cancelFriendRequest
);
router.delete("/:friendId/remove", protectRoute, friendController.removeFriend);

export default router;
