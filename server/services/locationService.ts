const { Location } = require('../models');

const getAllLocations = async (): Promise<Location> => {
  const locations = await Location.findAll();

  return locations;
};
export default {
  getAllLocations,

};