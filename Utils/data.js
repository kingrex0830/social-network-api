
const mongoose = require("mongoose");
const faker = require("faker");
// Generate a random username
const generateUsername = () => {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  return `${firstName}${lastName}`;
};

// Generate a random email
const generateEmail = () => {
  const username = generateUsername();
  const domain = faker.internet.domainName();
  return `${username}@${domain}`;
};

// Generate sample users
const generateUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const username = generateUsername();
    const email = generateEmail();
    users.push({ username, email });
  }
  return users;
};

// Generate sample thoughts with random user assignments
const generateThoughts = (users, count) => {
  const thoughts = [];
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const userId = user._id;
    const username = user.username;
    const thoughtText = faker.lorem.sentence();
    thoughts.push({ userId, username, thoughtText });
  }
  return thoughts;
};

// Generate sample reactions with random user and thought assignments
const generateReactions = (users, thoughts, count) => {
  const reactions = [];
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const userId = user._id;
    const username = user.username;
    const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
    const thoughtId = thought._id;
    const reactionBody = faker.lorem.sentence();
    reactions.push({ userId, username, thoughtId, reactionBody });
  }
  return reactions;
};

// Generate sample friends with random user assignments
const generateFriends = (users, count) => {
  const friendships = [];
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const friend = users.find(
      (u) => String(u._id) !== String(user._id) && !user.friends.includes(u._id)
    );
    if (friend) {
      friendships.push({ userId: user._id, friendId: friend._id });
      user.friends.push(friend._id);
    }
  }
  return friendships;
};

module.exports = {
  generateUsers,
  generateThoughts,
  generateReactions,
  generateFriends,
};