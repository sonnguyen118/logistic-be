const userModel = require('../models/userModel');

const userService = {};

// userService.getAllUsers = async () => {
//   try {
//     const users = await userModel.getAllUsers();
//     return users;
//   } catch (err) {
//     throw new Error('Unable to fetch users');
//   }
// };

// userService.getUserById = async (id) => {
//   try {
//     const user = await userModel.getUserById(id);
//     if (!user) {
//       throw new Error('User not found');
//     }
//     return user;
//   } catch (err) {
//     throw new Error('Unable to fetch user');
//   }
// };

module.exports = userService;
