const express = require("express");
const router = express.Router();

const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
  getAllReactions,
} = require("../../controllers/thoughtController");

// Routes for /api/thoughts
router.route("/").get(getAllThoughts).post(createThought);

router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router.route("/:thoughtId/reactions").get(getAllReactions).post(createReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;