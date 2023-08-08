const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Add a friend
router.post("/:id/friends", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { friendId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: "User is already a friend" });
    }

    user.friends.push(friendId);
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding friend:", err);
    res.status(500).json({ error: "Failed to add friend" });
  }
});

// Remove a friend
router.delete("/:id/friends/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ error: "User is not a friend" });
    }

    user.friends = user.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ error: "Failed to remove friend" });
  }
});

module.exports = router;