import prisma from "../config/db.js";

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { receiverId: req.user.id },
      include: {
        sender: { select: { username: true, avatar: true } },
      },
      orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllNotifications controller:", error.message);
  }
};

const getReadNotificationCount = async (req, res) => {
  try {
    const readCount = await prisma.notification.count({
      where: {
        receiverId: req.user.id,
        read: false,
      },
    });

    res.status(200).json(readCount);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error(
      "Error in getReadNotificationCount controller:",
      error.message
    );
  }
};

const readNotification = async (req, res) => {
  try {
    const notificationId = Number(req.params.notificationId);
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    if (notification.receiverId !== req.user.id) {
      return res
        .status(400)
        .json({ error: "You can't read other notification." });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in readNotification controller:", error.message);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { senderId } = req.params;
    const authUserId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { receiverId: authUserId, senderId, type: "FRIEND_REQUEST" },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    if (notification.receiverId !== req.user.id) {
      return res
        .status(400)
        .json({ error: "You can't delete other user's notification." });
    }

    await prisma.notification.delete({
      where: { id: notification.id },
    });

    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in deleteNotification controller:", error.message);
  }
};

export default {
  getAllNotifications,
  getReadNotificationCount,
  readNotification,
  deleteNotification,
};
