// require('crypto').randomBytes(64).toString('hex')

// Models

const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');
// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findAll({
    where: { status: 'active' },
    include: [{ model: Review, attributes: ['id', 'comment'] }],
  });

  res.status(200).json({
    restaurant,
  });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({ newRestaurant });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
    include: [{ model: Review, attributes: ['comment'] }],
  });

  if (!restaurant) {
    return next(
      new AppError('The restaurant you are looking for does not exist', 404)
    );
  }

  res.status(200).json({ restaurant });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, address } = req.body;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });
  await Restaurant.update({ name, address }, { where: { id } });

  res.status(200).json({
    restaurant,
    status: 'success',
  });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('User does not exist with given Id', 404));
  }
  await restaurant.update({ status: 'deleted' });

  res.status(200).json({
    restaurant,
    status: 'success',
  });
});

const createNewReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { id } = req.params;
  const { sessionUser } = req;

  const newReview = await Review.create({
    comment,
    rating,
    restaurantId: id,
    userId: sessionUser.id,
  });

  res.status(200).json({
    newReview,
    status: 'success',
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  await review.update({ comment, rating });

  res.status(200).json({
    review,
    status: 'si se cambio la review',
  });
});
const deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: 'deleted' });

  res.status(200).json({
    review,
    status: 'success',
  });
});

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.findAll({});

  res.status(200).json({
    reviews,
  });
});

module.exports = {
  getAllRestaurants,
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createNewReview,
  updateReview,
  deleteReview,
  getAllReviews,
};
