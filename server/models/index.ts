const Vehicle = require('./vehicle');
const Customer = require('./customer');
const Reservation = require('./reservation');
const Inquery = require('./inquery');
const Feedback = require('./feedback');

Customer.hasMany(Reservation);
Reservation.belongsTo(Customer);
Vehicle.hasOne(Reservation, {
  foreignKey: {
    allowNull: false // Cannot have reservation w/o vehicle_id
  }
});
Reservation.belongsTo(Vehicle);
Reservation.hasOne(Feedback, {
  foreignKey: {
    allowNull: false // Cannot have feedback w/o reservation_id
  }
});
Feedback.belongsTo(Reservation);

module.exports = {
  Vehicle, Customer, Reservation, Inquery, Feedback
};

export { };