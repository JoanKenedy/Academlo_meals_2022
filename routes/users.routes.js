const express = require('express');
const {
  protectToken,
  protectAccountOwner,
  userExists,
} = require('../middlewares/users.middlewares');

const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

const {
  getAllUsers,
  getUserByIdOrder,
  getUserByOrder,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkToken,
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/signup', createUserValidations, checkValidations, createUser);

router.post('/login', login);

// Apply protectedToken middleware

router.use(protectToken);

router.get('/', protectAccountOwner, getAllUsers);

router.patch('/:id', userExists, protectAccountOwner, updateUser);

router.delete('/:id', userExists, protectAccountOwner, deleteUser);

router.get('/orders', getUserByOrder);

router.get('/orders/:id', getUserByIdOrder);

router.get('/check-token', checkToken);

module.exports = { usersRouter: router };
