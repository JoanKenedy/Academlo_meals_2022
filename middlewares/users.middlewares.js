const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Review } = require('../models/review.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectToken = catchAsync(async (req, res, next) => {
  let token;

  // Extract token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // ['Bearer', 'token']
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Session invalid', 403));
  }

  // Validate token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // decoded returns -> { id: 1, iat: 1651713776, exp: 1651717376 }
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer available', 403)
    );
  }

  req.sessionUser = user;
  next();
});

const protectAdmin = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== 'admin') {
    return next(new AppError('Access not granted', 403));
  }

  next();
});

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'active' },
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    return next(new AppError('User does not exist with given Id', 404));
  }

  // Add user data to the req object
  req.user = user;
  next();
});

const orderExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, status: 'active' },
  });

  if (!order) {
    return next(
      new AppError('No existe la orden que se hizo en la petición', 404)
    );
  }

  req.order = order;

  next();
});

const reviewExist = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;

  const review = await Review.findOne({
    where: { restaurantId, id, status: 'active' },
  });

  if (!review) {
    return next(new AppError('Rewiew does not exist with given Id', 404));
  }

  req.review = review;

  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  // Get current session user and the user that is going to be updated
  const { sessionUser, user } = req;

  // Compare the id's
  if (sessionUser.id !== user.id) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  // If the ids are equal, the request pass
  next();
});

const protectOrderOwner = catchAsync(async (req, res, next) => {
  const { sessionUser, order } = req;
  // Compare the id's
  if (sessionUser.id !== order.userId) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  // If the ids are equal, the request pass
  next();
});

const protectReviewOwner = catchAsync(async (req, res, next) => {
  const { sessionUser, review } = req;
  // Compare the id's
  if (sessionUser.id !== review.userId) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  // If the ids are equal, the request pass
  next();
});

module.exports = {
  userExists,
  protectToken,
  protectAdmin,
  protectAccountOwner,
  orderExist,
  protectOrderOwner,
  reviewExist,
  protectReviewOwner,
};
