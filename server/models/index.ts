const Vehicle = require('./vehicle');
const Customer = require('./customer');
const Reservation = require('./reservation');
const Inquiry = require('./inquiry');
const Feedback = require('./feedback');
const Location = require('./location');

// Double One-to-Many relationship === Many-to-Many, but is more convenient and more methods available
Customer.hasMany(Reservation);
Reservation.belongsTo(Customer);

Vehicle.hasMany(Reservation, {
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
  foreignKey: {
    name: 'pickUpLocationId',
    allowNull: false // Cannot have reservation w/o location_id
  }
});

Location.hasOne(Reservation, {
  foreignKey: {
    name: 'pickUpLocationId',
    allowNull: false // Cannot have reservation w/o location_id
  }
});

Reservation.belongsTo(Location, {
  as: 'pickUpLocation',
  foreignKey: {
    name: 'pickUpLocationId',
    allowNull: false // Cannot have reservation w/o location_id
  }
} );
Reservation.belongsTo(Location, {
  as: 'dropOffLocation',
  foreignKey: {
    name: 'dropOffLocationId',
    allowNull: false // Cannot have reservation w/o location_id
  }
});



export {
  Vehicle, Customer, Reservation, Inquiry, Feedback, Location
};