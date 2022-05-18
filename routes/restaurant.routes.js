const express = require('express');
const {
  protectToken,
  protectAccountOwner,
  protectAdmin,
  reviewExist,
  protectReviewOwner,
} = require('../middlewares/users.middlewares');

const {
  createRestaurantValidations,
} = require('../middlewares/validations.middlewares');

const {
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createNewReview,
  updateReview,
  deleteReview,
  getAllReviews,
} = require('../controllers/restaurant.controller');

const router = express.Router();

// Apply protectedToken middleware
router.get('/', getAllRestaurants);

router.get('/:id', getRestaurantById);

router.get('/reviews', getAllReviews);

router.use(protectToken);

router.post('/', createRestaurantValidations, protectAdmin, createRestaurant);

router.patch('/:id', protectAdmin, updateRestaurant);

router.delete('/:id', protectAdmin, deleteRestaurant);

router.post('/reviews/:id', protectAdmin, createNewReview);

router.patch(
  '/reviews/:restaurantId/:id',
  reviewExist,
  protectReviewOwner,
  updateReview
);

router.delete(
  '/reviews/:restaurantId/:id',
  reviewExist,
  protectReviewOwner,
  deleteReview
);

module.exports = { restaurantsRouter: router };
