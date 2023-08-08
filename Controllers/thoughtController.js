const mongoose = require("mongoose");
const User = require("../models/User");
const Thought = require("../models/Thought");

const thoughtController = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find().populate("reactions");
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getThoughtById: async (req, res) => {
    try {
      const { id } = req.params;
      const thought = await Thought.findById(id).populate("reactions");
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  createThought: async (req, res) => {
    try {
      const { thoughtText, username, userId } = req.body;
      const newThought = await Thought.create({ thoughtText, username });
      // Push the created thought's _id to the associated user's thoughts array field
      await User.findByIdAndUpdate(userId, {
        $push: { thoughts: newThought._id },
      });
      res.status(201).json(newThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  updateThought: async (req, res) => {
    try {
      const { id } = req.params;
      const { thoughtText } = req.body;
      const updatedThought = await Thought.findByIdAndUpdate(
        id,
        { thoughtText },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteThought: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedThought = await Thought.findByIdAndDelete(id);
      if (!deletedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      // Pull and remove the deleted thought's _id from any associated user's thoughts array field
      await User.updateMany({}, { $pull: { thoughts: id } });
      res.json({ message: "Thought deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  createReaction: async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const { reactionBody, username } = req.body;
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: { reactionBody, username } } },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.status(201).json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteReaction: async (req, res) => {
    try {
      const { thoughtId, reactionId } = req.params;
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { reactionId } } },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  getAllReactions: async (req, res) => {
    try {
      const { thoughtId } = req.params;

      // Find the thought by ID and populate the reactions field
      const thought = await Thought.findById(thoughtId).populate("reactions");

      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      const reactions = thought.reactions;

      res.json(reactions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = thoughtController;