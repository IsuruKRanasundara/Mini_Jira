const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/userService');

const buildAuthToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const existingUser = await userService.findUserByEmail(req.body.email);

  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const user = await userService.createUser(req.body);

  return res.status(201).json({
    message: 'User created successfully',
    data: user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = buildAuthToken(user._id);

  return res.status(200).json({
    message: 'Login successful',
    token,
    data: user,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  return res.status(200).json({ data: users });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUserById(req.params.id, req.body);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({
    message: 'User updated successfully',
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.deleteUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
