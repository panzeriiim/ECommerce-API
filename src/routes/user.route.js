const express = require('express');
const userController = require('../controllers/user.controller');
const {
  signUp,
  login,
  autheticate,
  getResetOTP,
  resetPassword,
} = require('../controllers/auth.controller');

const userRoute = express.Router();
userRoute.get('/users', userController.getAllUsers);
userRoute.get('/userInfo', autheticate, userController.getUserInfo);
userRoute.post('/user/signup', signUp);
userRoute.post('/user/login', login);
userRoute.post('/user/getOTP', getResetOTP);
userRoute.post('/user/resetPassword', resetPassword);
userRoute.delete('/user/deleteAccount', autheticate, userController.deleteUser);

module.exports = userRoute;
