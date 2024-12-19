import bcrypt from "bcrypt";

import prisma from "../config/db.js";
import generateToken from "../services/auth.service.js";

const register = async (req, res) => {
  try {
    const { username, email, password, country, birthday } = req.body;

    if (!username || !email || !password || !country || !birthday) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const USERNAME_REGEX = /^[^\s]{1,15}$/;
    if (!USERNAME_REGEX.test(username.trim())) {
      return res.status(400).json({
        error:
          "Username must not contain spaces and must not exceed 15 characters.",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        country,
        birthday,
      },
    });

    generateToken(newUser.id, res);

    res.status(201).json({
      message: "Account created successfully.",
      newUser: {
        username: newUser.username,
        email: newUser.email,
        country: newUser.country,
        birthday: newUser.birthday,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in register controller:", error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    generateToken(user.id, res);

    res.status(200).json({
      message: "Logged in successfully.",
      user: {
        username: user.username,
        birthday: user.birthday,
        country: user.country,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in login controller:", error.message);
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in logout controller:", error.message);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        cover: true,
        country: true,
        birthday: true,
        friendsCount: true,
        likesReceivedCount: true,
        _count: { select: { posts: true } },
        createdAt: true,
        friends1: true,
        friends2: true,
        sentRequests: true,
        receivedRequests: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: No user found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getMe controller:", error.message);
  }
};

export default { register, login, logout, getMe };
