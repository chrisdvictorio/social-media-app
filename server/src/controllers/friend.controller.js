import prisma from "../config/db.js";

const getAllUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await prisma.friend.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      include: {
        user1: {
          select: { id: true, username: true, avatar: true, bio: true },
        },
        user2: {
          select: { id: true, username: true, avatar: true, bio: true },
        },
      },
    });

    const friendList = friends.map((friend) => {
      if (friend.user1Id === userId) {
        return {
          id: friend.user2.id,
          username: friend.user2.username,
          avatar: friend.user2.avatar,
          bio: friend.user2.bio,
        };
      } else {
        return {
          id: friend.user1.id,
          username: friend.user1.username,
          avatar: friend.user1.avatar,
          bio: friend.user1.bio,
        };
      }
    });

    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllUserFriends controller:", error.message);
  }
};

const getAllFriendRequests = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const friendRequests = await prisma.friendRequest.findMany({
      where: { receiverId: authUserId, status: "PENDING" },
      include: {
        sender: { select: { username: true, avatar: true, bio: true } },
      },
    });

    if (friendRequests.length === 0) {
      return res.status(200).json({ message: "No friend requests found." });
    }

    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllFriendRequests controller:", error.message);
  }
};

const getSingleFriendRequest = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const { userId } = req.params;

    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { receiverId: authUserId, senderId: userId, status: "PENDING" },
          { receiverId: userId, senderId: authUserId, status: "PENDING" },
        ],
      },
    });

    if (!friendRequest) {
      return res.status(200).json({ message: "Friend request not found." });
    }

    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllFriendRequests controller:", error.message);
  }
};

const getAllSentRequests = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const friendRequests = await prisma.friendRequest.findMany({
      where: { senderId: authUserId, status: "PENDING" },
      include: {
        receiver: { select: { username: true, avatar: true, bio: true } },
      },
    });

    if (friendRequests.length === 0) {
      return res.status(200).json({ message: "No friend requests found." });
    }

    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in getAllFriendRequests controller:", error.message);
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const { userId } = req.params;

    const authUser = await prisma.user.findUnique({
      where: { id: authUserId },
    });

    const userToAdd = await prisma.user.findUnique({ where: { id: userId } });

    if (!userToAdd) {
      return res.status(404).json({ error: "User not found." });
    }

    if (userToAdd.id === authUserId) {
      return res.status(404).json({ error: "You can't add yourself." });
    }

    const pendingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { receiverId: authUserId, senderId: userToAdd.id, status: "PENDING" },
          { receiverId: userToAdd.id, senderId: authUserId, status: "PENDING" },
        ],
      },
    });
    if (pendingRequest) {
      return res
        .status(400)
        .json({ error: "Friend request is already pending." });
    }

    const alreadyFriends = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            receiverId: authUserId,
            senderId: userToAdd.id,
            status: "ACCEPTED",
          },
          {
            receiverId: userToAdd.id,
            senderId: authUserId,
            status: "ACCEPTED",
          },
        ],
      },
    });

    if (alreadyFriends) {
      return res.status(400).json({ error: "You are already friends." });
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: authUserId,
        receiverId: userId,
        status: "PENDING",
      },
    });

    if (userToAdd.id !== authUserId) {
      await prisma.notification.create({
        data: {
          friendRequestId: friendRequest.id,
          senderId: authUser.id,
          receiverId: userToAdd.id,
          message: `@${authUser.username} sent a friend request.`,
          type: "FRIEND_REQUEST",
        },
      });
    }

    res.status(201).json({ message: "Friend request sent." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in sendFriendRequest controller:", error.message);
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const friendRequestId = Number(req.params.friendRequestId);

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: friendRequestId },
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
      },
    });

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    if (friendRequest.receiverId !== authUserId) {
      return res
        .status(404)
        .json({ error: "You can't accept other user's friend request." });
    }

    await prisma.friend.create({
      data: {
        user1Id: friendRequest.senderId,
        user2Id: friendRequest.receiverId,
      },
    });

    await prisma.user.update({
      where: { id: friendRequest.senderId },
      data: {
        friendsCount: { increment: 1 },
      },
    });

    await prisma.user.update({
      where: { id: friendRequest.receiverId },
      data: {
        friendsCount: { increment: 1 },
      },
    });

    await prisma.friendRequest.update({
      where: { id: friendRequestId },
      data: { status: "ACCEPTED" },
    });

    await prisma.notification.create({
      data: {
        senderId: friendRequest.receiverId,
        receiverId: friendRequest.senderId,
        message: `You are now friends with @${friendRequest.receiver.username}.`,
        type: "FRIENDS",
      },
    });

    await prisma.notification.create({
      data: {
        senderId: friendRequest.senderId,
        receiverId: friendRequest.receiverId,
        message: `You are now friends with @${friendRequest.sender.username}.`,
        type: "FRIENDS",
      },
    });

    res.status(200).json({
      message: `You are now friends with ${friendRequest.sender.username}.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in acceptFriendRequest controller:", error.message);
  }
};

const declineFriendRequest = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const friendRequestId = Number(req.params.friendRequestId);
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: friendRequestId },
    });

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    if (friendRequest.receiverId !== authUserId) {
      return res
        .status(400)
        .json({ error: "You can't decline other user's friend request." });
    }

    await prisma.friendRequest.delete({ where: { id: friendRequestId } });

    res.status(200).json({ message: "Friend request removed." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in declineFriendRequest controller:", error.message);
  }
};

const cancelFriendRequest = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const friendRequestId = Number(req.params.friendRequestId);

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: friendRequestId },
    });

    if (!friendRequest) {
      return res.status(404).json({ error: "No friend request found." });
    }

    if (friendRequest.senderId !== authUserId) {
      return res
        .status(400)
        .json({ error: "You can't cancel other user's friend request." });
    }

    const notification = await prisma.notification.findFirst({
      where: {
        senderId: friendRequest.senderId,
        receiverId: friendRequest.receiverId,
        type: "FRIEND_REQUEST",
      },
    });

    await prisma.friendRequest.delete({ where: { id: friendRequest.id } });

    await prisma.notification.delete({
      where: {
        id: notification.id,
      },
    });

    res.status(201).json({ message: "Friend request canceled." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in cancelFriendRequest controller:", error.message);
  }
};

const removeFriend = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const { friendId } = req.params;

    const friend = await prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: authUserId, user2Id: friendId },
          { user1Id: friendId, user2Id: authUserId },
        ],
      },
    });

    if (!friend) {
      return res
        .status(400)
        .json({ error: "You are not friends with this user." });
    }

    await prisma.friend.deleteMany({
      where: {
        OR: [
          { user1Id: authUserId, user2Id: friendId },
          { user1Id: friendId, user2Id: authUserId },
        ],
      },
    });
    await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          {
            receiverId: authUserId,
            senderId: friendId,
            status: "ACCEPTED",
          },
          {
            receiverId: friendId,
            senderId: authUserId,
            status: "ACCEPTED",
          },
        ],
      },
    });
    await prisma.user.update({
      where: { id: authUserId },
      data: { friendsCount: { decrement: 1 } },
    });
    await prisma.user.update({
      where: { id: friendId },
      data: { friendsCount: { decrement: 1 } },
    });

    return res.status(200).json({ message: "You removed a friend." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
    console.error("Error in removeFriend controller:", error.message);
  }
};

export default {
  getAllUserFriends,
  getAllFriendRequests,
  getSingleFriendRequest,
  getAllSentRequests,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
};
