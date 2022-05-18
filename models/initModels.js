const { User } = require('./user.model');
const { Restaurant } = require('./restaurant.model');
const { Review } = require('./review.model');
const { Order } = require('./order.model');
const { Meal } = require('./meal.model');
// Establish your models relations inside this function
const initModels = () => {
  // Relacion entre un usuario y varias ordenes
  // Y una orden tiene un usuario
  User.hasMany(Order);
  Order.belongsTo(User);

  // Relacion entre usuario puede tener muchas reseñas
  // Y una reseña le pertenece a un usuario

  User.hasMany(Review);
  Review.belongsTo(User);

  //Relacion entre restaurantes con una comida
  // Y una comida le pertenecen a un restaurante

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  //Relacion entre restautrante puede tener muchos review
  // Y una review le pertenece a un restaurante

  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  //Relacion de uno a uno entre  orden y comidas
  Meal.hasOne(Order);
  Order.belongsTo(Meal);
};

module.exports = { initModels };
