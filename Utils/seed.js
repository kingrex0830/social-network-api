const { connect, connection } = require("mongoose");
const User = require("../models/User");
const Thought = require("../models/Thought");
const Friend = require("../models/Friend");
const Reaction = require("../models/Reaction");

const {
  generateUsers,
  generateThoughts,
  generateReactions,
  generateFriends,
} = require("./data");

const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/MetaPicks";

connect(connectionString);

connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

connection.once("open", async () => {
  console.log("Connected to MongoDB");
  try {
    // Drop existing collections
    await User.deleteMany({});
    await Thought.deleteMany({});
    await Reaction.deleteMany({});
    await Friend.deleteMany({});

    // Generate sample users and thoughts
    const users = generateUsers(10);

    // Create users
    const createdUsers = await User.create(users);

    const thoughts = generateThoughts(createdUsers, 20);

    // Create thoughts and associate them with respective users
    const createdThoughts = await Thought.create(
      thoughts.map((thought) => ({
        ...thought,
        username: thought.userId,
      }))
    );

    // Update users' thoughts field
    const updatedUsers = createdUsers.map((user) => {
      const userThoughts = createdThoughts
        .filter((thought) => String(thought.userId) === String(user._id))
        .map((thought) => thought._id);
      return { ...user, thoughts: userThoughts };
    });

    await Promise.all(
      updatedUsers.map((user) =>
        User.findByIdAndUpdate(user._id, { thoughts: user.thoughts })
      )
    );

    // Generate sample friends
    const friends = generateFriends(createdUsers, 5);

    // Create friends associations
    await Friend.create(friends);

    // Generate sample reactions
    const reactions = generateReactions(createdUsers, createdThoughts, 10);

    // Create reactions and associate them with respective thoughts
    await Reaction.create(reactions);

    console.log("Seed data created successfully");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    // Close the database connection
    connection.close();
  }
});