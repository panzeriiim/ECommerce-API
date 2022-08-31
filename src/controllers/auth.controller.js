const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/user.model');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../errors/appError');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, res) => {
  const accessToken = signToken(user.id);
  const cookieOption = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('acessToken', accessToken, cookieOption);
  res.json({
    status: 'success',
    accessToken,
    user,
  });
};

exports.signUp = asyncWrapper(async (req, res) => {
  const user = await User.create(req.body);
  createSendToken(user, res);
  res.json({
    status: 'success',
    user,
  });
});
exports.login = asyncWrapper(async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password)
    return next(new AppError('please enter your username and password', 401));
  const user = await User.findOne({ userName: userName });
  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError('wrong username or password', 401));
  createSendToken(user, res);
});

exports.autheticate = asyncWrapper(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token)
    return next(
      new AppError('you are not login. Plase login to grant the access', 401)
    );
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findOne({ _id: decoded.userId });
  if (!user)
    return next(
      new AppError('The user that own this token is no longer exist'),
      401
    );
  req.user = user;
  next();
});
exports.getResetOTP = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('there is no user with that email address.', 404));
  const string =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let OTP = '';

  // Find the length of string
  const len = string.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    OTP += string[Math.floor(Math.random() * len)];
  }
  await sendEmail({
    email: user.email,
    subject: 'reset password OTP',
    message: `This is your OTP : ${OTP}. This OTP will be expired after 5 minutes.`,
  });
  user.OTP = OTP;
  user.OTPSendTime = new Date();
  await user.save();
});
exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const { OTP, email, password } = req.body;
  if (!OTP || !email || !password)
    return next(new AppError('There are some missing fileds', 401));
  const user = await User.findOne({ OTP, email });
  if (!user) return next(new AppError('Invalid OTP', 401));
  const currentTime = new Date();
  if (currentTime.getTime() - user.OTPSendTime.getTime() > 5 * 60 * 1000)
    return next(
      new AppError('Your OTP has been expired. Please request onother OTP', 401)
    );
  user.password = password;
  user.OTP = '';
  user.OTPSendTime = undefined;
  await user.save();
  const token = signToken(user._id);
  res.json({
    status: 'success',
    token: token,
  });
});
