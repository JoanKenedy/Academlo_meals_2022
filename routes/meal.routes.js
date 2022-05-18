const express = require('express');
const {
  protectToken,
  protectAccountOwner,
  protectAdmin,
} = require('../middlewares/users.middlewares');
const {
  createMealValidations,
} = require('../middlewares/validations.middlewares');

const {
  getAllMeal,
  createMeal,
  getMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/meal.controller');

const router = express.Router();

// Apply protectedToken middleware
router.get('/', getAllMeal);

router.get('/:id', getMealById);

router.use(protectToken);

router.post('/:id', createMealValidations, protectAdmin, createMeal);

router.patch('/:id', protectAdmin, updateMeal);

router.delete('/:id', protectAdmin, deleteMeal);

module.exports = { mealRouter: router };
