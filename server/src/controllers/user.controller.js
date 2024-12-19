import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
      },
      select: { id: true, username: true, bio: true, avatar: true },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllUsers controller:", error.message);
  }
};

const getRandomUsers = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const randomUsers = await prisma.user.findManyRandom(4, {
      where: {
        id: {
          not: authUserId,
        },
      },
      select: { id: true, username: true, bio: true, avatar: true },
    });

    const filteredUsers = randomUsers.filter((user) => user.id !== authUserId);

    const users = filteredUsers.slice(0, 2);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getRandomUsers controller:", error.message);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatar: true,
        cover: true,
        country: true,
        birthday: true,
        friendsCount: true,
        likesReceivedCount: true,
        _count: { select: { posts: true } },
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getSingleUser controller:", error.message);
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const authUserId = req.user.id;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: { id: true, username: true, bio: true, avatar: true },
    });

    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in searchUsers controller:", error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    let { avatar, cover, password } = req.body;
    const { username, bio, email, country, birthday, confirmPassword } =
      req.body;
    const authUserId = req.user.id;

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    if (username) {
      const USERNAME_REGEX = /^[^\s]{1,15}$/;
      if (!USERNAME_REGEX.test(username.trim())) {
        return res.status(400).json({
          error:
            "Username must not contain spaces and must not exceed 15 characters.",
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists." });
      }
    }

    if (email) {
      const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
      }

      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: "Email is already registered." });
      }
    }

    if (bio && bio.length > 250) {
      return res
        .status(400)
        .json({ error: "Bio should not exceed 250 characters." });
    }

    if (avatar) {
      if (authUser.avatar) {
        const publicId = authUser.avatar.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(
            `social-media-app/users/avatar/${publicId}`
          );
          console.log("Image deleted from cloudinary");
        } catch (error) {
          console.error("Error deleting image from cloudinary:", error.message);
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(avatar, {
        folder: "social-media-app/users/avatar",
      });
      avatar = cloudinaryResponse.secure_url;
    }

    if (cover) {
      if (authUser.cover) {
        const publicId = authUser.cover.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(
            `social-media-app/users/cover/${publicId}`
          );
          console.log("Image deleted from cloudinary");
        } catch (error) {
          console.error("Error deleting image from cloudinary:", error.message);
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(cover, {
        folder: "social-media-app/users/cover",
      });
      cover = cloudinaryResponse.secure_url;
    }

    if (password) {
      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          return res
            .status(400)
            .json({ error: "Passwords do not match. Please try again." });
        }

        const isSamePassword = await bcrypt.compare(
          password,
          authUser.password
        );
        if (isSamePassword) {
          return res
            .status(400)
            .json({ error: "New password can't be the same as the old one." });
        }

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      } else {
        return res
          .status(400)
          .json({ error: "Both password and confirm password are required." });
      }
    }

    await prisma.user.update({
      where: { id: authUserId },
      data: {
        avatar: avatar || authUser.avatar,
        cover: cover || authUser.cover,
        username: username || authUser.username,
        bio: bio || authUser.bio,
        email: email || authUser.email,
        country: country || authUser.country,
        birthday: birthday || authUser.birthday,
        password: password || authUser.password,
      },
    });

    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in updateUser controller:", error.message);
  }
};

export default {
  getAllUsers,
  getRandomUsers,
  getSingleUser,
  searchUsers,
  updateUser,
};
