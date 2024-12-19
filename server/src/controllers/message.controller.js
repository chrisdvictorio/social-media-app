import { io, userSocketMap } from "../socket/socket.js";
import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const getSingleConversation = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const { userId } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { id: authUserId },
            },
          },
          {
            participants: {
              some: { id: userId },
            },
          },
        ],
      },
      include: {
        participants: { select: { id: true, username: true, avatar: true } },
        messages: {
          include: { sender: { select: { username: true, avatar: true } } },
        },
      },
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getSingleConversation controller:", error.message);
  }
};

const getAllConversation = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { id: authUserId } },
      },
      include: {
        participants: { select: { id: true, username: true, avatar: true } },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const updatedConversations = conversations.map((conversation) => {
      const filteredParticipants = conversation.participants.filter(
        (participant) => participant.id !== authUserId
      );
      return {
        ...conversation,
        participants: filteredParticipants,
      };
    });

    res.status(200).json(updatedConversations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllConversation controller:", error.message);
  }
};

const createMessage = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const { userId } = req.params;
    const { text } = req.body;
    let { image } = req.body;

    if (!image && !text) {
      return res
        .status(400)
        .json({ error: "Your message should have a text or image." });
    }

    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "social-media-app/messages",
      });
      image = cloudinaryResponse.secure_url;
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: authUserId } } },
          { participants: { some: { id: userId } } },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: authUserId }, { id: userId }],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        text,
        image,
        senderId: authUserId,
        conversationId: conversation.id,
      },
    });

    const socketId = userSocketMap[userId];

    if (socketId) {
      io.to(socketId).emit("newMessage", {
        message: newMessage,
        senderId: authUserId,
      });
    }

    res.status(201).json({ newMessage, message: "Message Sent." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in createMessage controller:", error.message);
  }
};

export default { getAllConversation, getSingleConversation, createMessage };
