const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllFriends,
  addFriend,
  removeFriend,
} = require("../../controllers/userController.js");

// Routes for /api/users
router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router
  .route("/:id/friends")
  .get(getAllFriends)
  .post(addFriend)
  .delete(removeFriend);
router.route("/:id/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;