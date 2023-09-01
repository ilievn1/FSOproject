const Vehicle = require('./vehicle');
const Customer = require('./customer');
const Reservation = require('./reservation');
const Inquiry = require('./inquiry');
const Feedback = require('./feedback');
const Location = require('./location');

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

Location.hasOne(Reservation, {
  as: 'PickUpLocation',
  foreignKey: {
    name: 'pickUpLocationId',
    allowNull: false // Cannot have reservation w/o location_id
  }
});

Location.hasOne(Reservation, {
  as: 'DropOffLocation',
  foreignKey: {
    name: 'dropOffLocationId',
    allowNull: false // Cannot have reservation w/o location_id
  }
});

Reservation.belongsTo(Location);


export {
  Vehicle, Customer, Reservation, Inquiry, Feedback, Location
};