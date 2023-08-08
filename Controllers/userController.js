const mongoose = require("mongoose");
const User = require("../models/User");
const Thought = require("../models/Thought");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate("thoughts").populate("friends");
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate the user ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id)
        .populate("thoughts")
        .populate({
          path: "friends",
          populate: {
            path: "friends",
            model: "User",
          },
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getAllFriends: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate the user ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id).populate("friends");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user.friends);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email } = req.body;
      const newUser = await User.create({ username, email });
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      // Remove user's associated thoughts
      await Thought.deleteMany({ username: deletedUser.username });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  addFriend: async (req, res) => {
    try {
      const { id } = req.params;
      const { friendId } = req.body;

      // Validate the user ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Validate the friend ID
      if (!mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(400).json({ message: "Invalid friend ID" });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { $addToSet: { friends: friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  removeFriend: async (req, res) => {
    try {
      const { id, friendId } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { $pull: { friends: friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = userController;