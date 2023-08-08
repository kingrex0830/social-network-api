const router = require("express").Router();
const userRoutes = require("./api/users");
const thoughtRoutes = require("./api/thoughts");
const reactionsRoutes = require("./api/reactions");
const friendsRoutes = require("./api/friends");

router.use("/api/users", userRoutes);
router.use("/api/thoughts", thoughtRoutes);

router.use("/api/thoughts/:thoughtId/reactions", reactionsRoutes);
router.use("/api/users/:userId/friends", friendsRoutes);

router.use((req, res) => res.send("Wrong route!"));

module.exports = router;