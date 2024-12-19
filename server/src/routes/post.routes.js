import express from "express";

import postController from "../controllers/post.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, postController.createPost);
router.get("/", protectRoute, postController.getAllPosts);
router.get("/friends", protectRoute, postController.getAllFriendsPosts);
router.get("/likes", protectRoute, postController.getAllLikedPosts);
router.get("/saved", protectRoute, postController.getAllBookmarkedPosts);
router.get("/:userId/posts", protectRoute, postController.getUserPosts);
router.get("/:userId/images", protectRoute, postController.getUserMediaPosts);
router.get("/:postId", protectRoute, postController.getSinglePost);
router.patch("/:postId/update", protectRoute, postController.updatePost);
router.delete("/:postId/delete", protectRoute, postController.deletePost);

router.post("/:postId/comments", protectRoute, postController.createComment);
router.patch(
  "/:postId/comments/:commentId/update",
  protectRoute,
  postController.updateComment
);
router.delete(
  "/:postId/comments/:commentId/delete",
  protectRoute,
  postController.deleteComment
);

router.post("/:postId/like", protectRoute, postController.likePost);
router.post("/:postId/save", protectRoute, postController.bookmarkPost);

export default router;
