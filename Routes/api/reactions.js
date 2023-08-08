const express = require("express");
const router = express.Router();
const Thought = require("../../models/Thought");

// Create a new reaction
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const { reactionBody, username } = req.body;

    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    thought.reactions.push({ reactionBody, username });
    await thought.save();

    res.status(201).json(thought);
  } catch (err) {
    console.error("Error creating reaction:", err);
    res.status(500).json({ error: "Failed to create reaction" });
  }
});

// Delete a reaction
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    thought.reactions = thought.reactions.filter(
      (reaction) => reaction.id.toString() !== reactionId
    );
    await thought.save();

    res.status(200).json(thought);
  } catch (err) {
    console.error("Error deleting reaction:", err);
    res.status(500).json({ error: "Failed to delete reaction" });
  }
});

module.exports = router;