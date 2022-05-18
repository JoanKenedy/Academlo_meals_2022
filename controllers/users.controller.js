const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// require('crypto').randomBytes(64).toString('hex')

// Models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    /* attributes: { exclude: ['password'] },*/
  });

  res.status(200).json({
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  user.password = undefined;

  res.status(200).json({ token, user });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  // const { id } = req.params;
  const { name, email } = req.body;

  // await User.update({ name }, { where: { id } });

  // const user = await User.findOne({ where: { id } });

  await user.update({ name, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  // const { id } = req.params;

  // DELETE FROM ...
  // await user.destroy();
  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

const getUserByOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const userOrders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [
      {
        model: Meal,
        attributes: ['name'],
        include: [{ model: Restaurant, attributes: ['name', 'rating'] }],
      },
    ],
  });

  res.status(200).json({
    userOrders,
    status: 'success',
  });
});

const getUserByIdOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;
  const userOrders = await Order.findOne({
    where: { id, userId: sessionUser.id },
    include: [
      {
        model: Meal,
        attributes: ['name'],
        include: [{ model: Restaurant, attributes: ['name'] }],
      },
    ],
  });

  res.status(200).json({
    userOrders,
    status: 'success',
  });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
  getAllUsers,
  getUserByIdOrder,
  getUserByOrder,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkToken,
};
