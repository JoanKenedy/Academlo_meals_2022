const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Controllers
const { globalErrorHandler } = require('./controllers/errors.controller');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { restaurantsRouter } = require('./routes/restaurant.routes');
const { mealRouter } = require('./routes/meal.routes');
const { orderRouter } = require('./routes/order.routes');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: 'Too many requests from this IP',
});

app.use(limiter);

// Endpoints
// http://localhost:4000/api/v1/users
app.use('/api/v1/users', usersRouter);

// http://localhost:4000/api/v1/restaurants
app.use('/api/v1/restaurants', restaurantsRouter);

// http://localhost:4000/api/v1/meals
app.use('/api/v1/meals', mealRouter);
// http://localhost:4000/api/v1/orders
app.use('/api/v1/orders', orderRouter);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
