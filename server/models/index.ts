const Vehicle = require('./vehicle');
const Customer = require('./customer');
const Reservation = require('./reservation');
const Inquery = require('./inquery');

Customer.hasMany(Reservation);
Reservation.belongsTo(Customer);
Vehicle.hasOne(Reservation, {
  foreignKey: {
    allowNull: false
  }
});
Reservation.belongsTo(Vehicle);
module.exports = {
  Vehicle, Customer, Reservation, Inquery
};

export { };