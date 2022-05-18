const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError');

const createUserValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role').notEmpty().withMessage('You must assign a role to the user'),
];
const createRestaurantValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('address')
    .notEmpty()
    .withMessage('Debe llevar calle , numero y colonia'),
  body('rating')
    .notEmpty()
    .withMessage('Debe ser un numero al valor de clasificación'),
];
const createMealValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('price').notEmpty().withMessage('Debes poner el precio de la comida'),
];
const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return next(new AppError(errorMsg, 400));
  }

  next();
};

module.exports = {
  createUserValidations,
  createRestaurantValidations,
  checkValidations,
  createMealValidations,
};
