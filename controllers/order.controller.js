// require('crypto').randomBytes(64).toString('hex')

// Models
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const getAllOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findAll({
    where: { status: 'active' },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: [
          { model: Restaurant, attributes: ['name', 'address', 'rating'] },
        ],
      },
    ],
  });

  res.status(200).json({
    order,
  });
});

const createOrder = catchAsync(async (req, res, next) => {
  const { quantity, receiverAccountNumber } = req.body;
  const { sessionUser } = req;
  console.log(receiverAccountNumber);

  const meal = await Meal.findOne({
    where: { id: receiverAccountNumber, status: 'active' },
  });

  if (!meal) {
    return next(new AppError('No existe esa comida en el restaurante', 404));
  }
  const mealId = meal.id;

  const totalPrice = quantity * meal.price;

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser.id,
    quantity,
    totalPrice,
  });

  res.status(200).json({
    newOrder,
    status: 'success',
  });
});

const getOrderByIdPending = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(200).json({
    order,
    status: 'success',
  });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'deleted' });

  res.status(200).json({
    order,
    status: 'success',
  });
});

module.exports = {
  getAllOrder,
  createOrder,
  getOrderByIdPending,
  deleteOrder,
};
