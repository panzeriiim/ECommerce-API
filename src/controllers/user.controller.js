const User = require('../models/user.model');
const asyncWrapper = require('../utils/asyncWrapper');
const { createSendToken } = require('./auth.controller');

exports.signUp = asyncWrapper(async (req, res) => {
  const user = await User.create(req.body);
  createSendToken(user, res);
  res.json({
    status: 'success',
    user,
  });
});
exports.getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  res.json({ message: 'success', users });
});
exports.deleteUser = asyncWrapper(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  res.json({ message: 'user deleted', user });
});
exports.getUserInfo = asyncWrapper(async (req, res) => {
  res.json({ user: req.user });
});
