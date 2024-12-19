import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const createPost = async (req, res) => {
  try {
    let { image } = req.body;
    const { text } = req.body;

    if (!text && !image) {
      return res.status(400).json({
        error: "Your post should have either text or an image.",
      });
    }

    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "social-media-app/posts",
      });
      image = cloudinaryResponse.secure_url;
    }

    const newPost = await prisma.post.create({
      data: {
        authorId: req.user.id,
        text: text || "",
        image: image || "",
      },
    });

    res.status(201).json({ message: "Post created successfully.", newPost });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in createPost controller:", error.message);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            bio: true,
            friendsCount: true,
            likesReceivedCount: true,
            _count: { select: { posts: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                friendsCount: true,
                likesReceivedCount: true,
                _count: { select: { posts: true } },
              },
            },
          },
        },
        likes: { select: { id: true, userId: true } },
        bookmarks: { select: { id: true, userId: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return res.status(200).json({ message: "There are no posts." });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllPosts controller:", error.message);
  }
};

const getAllFriendsPosts = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ user1Id: authUserId }, { user2Id: authUserId }],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    const friendIds = friends.flatMap((friend) =>
      friend.user1Id === authUserId ? friend.user2Id : friend.user1Id
    );

    const posts = await prisma.post.findMany({
      where: { authorId: { in: friendIds } },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            bio: true,
            friendsCount: true,
            likesReceivedCount: true,
            _count: { select: { posts: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                friendsCount: true,
                likesReceivedCount: true,
                _count: { select: { posts: true } },
              },
            },
          },
        },
        likes: { select: { id: true, userId: true } },
        bookmarks: { select: { id: true, userId: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return res.status(200).json({ message: "There are no posts." });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllFriendsPosts controller:", error.message);
  }
};

const getAllLikedPosts = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const likes = await prisma.like.findMany({
      where: { userId: authUserId },
      include: {
        post: {
          include: {
            author: {
              select: {
                username: true,
                avatar: true,
                bio: true,
                friendsCount: true,
                likesReceivedCount: true,
                _count: { select: { posts: true } },
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    friendsCount: true,
                    likesReceivedCount: true,
                    _count: { select: { posts: true } },
                  },
                },
              },
            },
            likes: { select: { id: true, userId: true } },
            bookmarks: { select: { id: true, userId: true } },
            _count: {
              select: { likes: true, comments: true, bookmarks: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const posts = likes.map((like) => like.post);

    if (posts.length === 0) {
      return res.status(200).json({ message: "You have no liked posts." });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllLikedPosts controller:", error.message);
  }
};

const getAllBookmarkedPosts = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: authUserId },
      include: {
        post: {
          include: {
            author: {
              select: {
                username: true,
                avatar: true,
                bio: true,
                friendsCount: true,
                likesReceivedCount: true,
                _count: { select: { posts: true } },
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    friendsCount: true,
                    likesReceivedCount: true,
                    _count: { select: { posts: true } },
                  },
                },
              },
            },
            likes: { select: { id: true, userId: true } },
            bookmarks: { select: { id: true, userId: true } },
            _count: {
              select: { likes: true, comments: true, bookmarks: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const posts = bookmarks.map((bookmark) => bookmark.post);

    if (posts.length === 0) {
      return res.status(200).json({ message: "You have no saved posts." });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllBookmarkedPosts controller:", error.message);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            bio: true,
            friendsCount: true,
            likesReceivedCount: true,
            _count: { select: { posts: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                friendsCount: true,
                likesReceivedCount: true,
                _count: { select: { posts: true } },
              },
            },
          },
        },
        likes: { select: { id: true, userId: true } },
        bookmarks: { select: { id: true, userId: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!posts) {
      return res.status(200).json({ message: "User has no posts." });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getUserPosts controller:", error.message);
  }
};

const getUserMediaPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await prisma.post.findMany({
      where: { authorId: userId, image: { not: "" } },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            bio: true,
            friendsCount: true,
            likesReceivedCount: true,
            _count: { select: { posts: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                friendsCount: true,
                likesReceivedCount: true,
                _count: { select: { posts: true } },
              },
            },
          },
        },
        likes: { select: { id: true, userId: true } },
        bookmarks: { select: { id: true, userId: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!posts) {
      return res.status(200).json({ message: "User has no media posts." });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getUserMediaPosts controller:", error.message);
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            bio: true,
            friendsCount: true,
            likesReceivedCount: true,
            _count: { select: { posts: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                friendsCount: true,
                likesReceivedCount: true,
                _count: { select: { posts: true } },
              },
            },
          },
        },
        likes: { select: { id: true, userId: true } },
        bookmarks: { select: { id: true, userId: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "No post found." });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getSinglePost controller:", error.message);
  }
};

const updatePost = async (req, res) => {
  try {
    let { text, image } = req.body;
    const postId = Number(req.params.postId);

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: "No post found." });
    }

    if (post.authorId !== req.user.id) {
      return res
        .status(400)
        .json({ error: "You can't update other user's post." });
    }

    if (image) {
      if (post.image) {
        const publicId = post.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(
            `social-media-app/posts/${publicId}`
          );
          console.log("Image deleted from cloudinary");
        } catch (error) {
          console.error("Error deleting image from cloudinary:", error.message);
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "social-media-app/posts",
      });
      image = cloudinaryResponse.secure_url;
    }

    text = text || post.text;
    image = image || post.image;

    await prisma.post.update({ where: { id: postId }, data: { text, image } });

    res.status(200).json({
      message: "Post updated successfully.",
      post: { text, image },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in updatePost controller:", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { _count: { select: { likes: true } } },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.authorId !== req.user.id) {
      return res
        .status(400)
        .json({ error: "You can't delete other user's post." });
    }

    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`social-media-app/posts/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.error("Error deleting image from cloudinary:", error.message);
      }
    }

    await prisma.post.delete({ where: { id: postId } });
    await prisma.user.update({
      where: { id: post.authorId },
      data: { likesReceivedCount: { decrement: post._count.likes } },
    });

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in deletePost controller:", error.message);
  }
};

const createComment = async (req, res) => {
  try {
    let { text } = req.body;
    const authUserId = req.user.id;
    const postId = Number(req.params.postId);

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!text) {
      return res.status(404).json({ error: "Your comment must have a text." });
    }

    await prisma.comment.create({
      data: { text, authorId: authUserId, postId },
    });

    if (post.authorId !== authUserId) {
      await prisma.notification.create({
        data: {
          postId: postId,
          receiverId: post.authorId,
          senderId: authUser.id,
          message: `@${authUser.username} commented on your post.`,
          type: "COMMENT",
        },
      });
    }

    res.status(201).json({ message: "Commented successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in createComment controller:", error.message);
  }
};

const updateComment = async (req, res) => {
  try {
    let { text } = req.body;
    const commentId = Number(req.params.commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!text) {
      return res
        .status(400)
        .json({ error: "Your comment should have a text." });
    }

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.authorId !== req.user.id) {
      return res
        .status(400)
        .json({ error: "You can't update other's comment." });
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { text, isEdited: true },
    });

    res.status(200).json({ message: "Comment updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in updateComment controller:", error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.authorId !== req.user.id) {
      return res
        .status(400)
        .json({ error: "You can't delete other's comment." });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in deleteComment controller:", error.message);
  }
};

const likePost = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const postId = Number(req.params.postId);

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    const existingLike = await prisma.like.findFirst({
      where: { userId: authUserId, postId },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      await prisma.user.update({
        where: { id: post.authorId },
        data: { likesReceivedCount: { decrement: 1 } },
      });

      res.status(200).json({ message: "Post unliked successfully." });
    } else {
      await prisma.like.create({ data: { userId: authUserId, postId } });
      await prisma.user.update({
        where: { id: post.authorId },
        data: { likesReceivedCount: { increment: 1 } },
      });
      if (post.authorId !== authUserId) {
        await prisma.notification.create({
          data: {
            postId: postId,
            receiverId: post.authorId,
            senderId: authUser.id,
            message: `@${authUser.username} liked your post.`,
            type: "LIKE",
          },
        });
      }
      res.status(200).json({ message: "Post liked successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in likePost controller:", error.message);
  }
};

const bookmarkPost = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const postId = Number(req.params.postId);

    const post = await prisma.post.findUnique({ where: { id: postId } });

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    const existingBookMark = await prisma.bookmark.findFirst({
      where: { userId: authUserId, postId },
    });

    if (existingBookMark) {
      await prisma.bookmark.delete({ where: { id: existingBookMark.id } });
      res.status(200).json({ message: "Saved post removed successfully." });
    } else {
      await prisma.bookmark.create({ data: { userId: authUserId, postId } });
      if (post.authorId !== authUserId) {
        await prisma.notification.create({
          data: {
            postId: postId,
            receiverId: post.authorId,
            senderId: authUser.id,
            message: `@${authUser.username} saved your post.`,
            type: "SAVE",
          },
        });
      }
      res.status(200).json({ message: "Post saved successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in bookmarkPost controller:", error.message);
  }
};

export default {
  createPost,
  getAllPosts,
  getAllFriendsPosts,
  getAllLikedPosts,
  getAllBookmarkedPosts,
  getUserPosts,
  getUserMediaPosts,
  getSinglePost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  likePost,
  bookmarkPost,
};
