// require('crypto').randomBytes(64).toString('hex')

// Models

const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.findAll({
    where: { status: 'active' },
    include: [{ model: Restaurant, attributes: ['name', 'address', 'rating'] }],
  });

  res.status(200).json({
    meal,
  });
});

const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({ newMeal });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
    include: [{ model: Restaurant, attributes: ['name', 'address', 'rating'] }],
  });

  if (!meal) {
    return next(
      new AppError('The restaurant you are looking for does not exist', 404)
    );
  }

  res.status(200).json({ meal });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
  });
  await Meal.update({ name, price }, { where: { id } });

  res.status(200).json({
    meal,
    status: 'success',
  });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
  });

  if (!meal) {
    return next(new AppError('User does not exist with given Id', 404));
  }
  await meal.update({ status: 'deleted' });

  res.status(200).json({
    meal,
    status: 'success',
  });
});

module.exports = {
  getAllMeal,
  createMeal,
  getMealById,
  updateMeal,
  deleteMeal,
};
