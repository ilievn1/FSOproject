const Vehicle = require('./vehicle');
const Customer = require('./customer');
const Reservation = require('./reservation');
const Inquiry = require('./inquiry');
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

export {
  Vehicle, Customer, Reservation, Inquiry, Feedback
};