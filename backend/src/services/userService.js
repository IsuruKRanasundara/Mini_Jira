const User = require('../models/User');

const createUser = async (payload) => {
  const user = await User.create(payload);
  return user;
};

const findUserByEmail = async (email) => {
  return User.findOne({ email }).select('+password');
};

const getAllUsers = async () => {
  return User.find();
};

const getUserById = async (id) => {
  return User.findById(id);
};

const updateUserById = async (id, payload) => {
  if (payload.password) {
    const user = await User.findById(id).select('+password');
    if (!user) {
      return null;
    }

    Object.assign(user, payload);
    await user.save();
    return user;
  }

  return User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteUserById = async (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
