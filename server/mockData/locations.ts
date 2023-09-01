import { Location } from '../types';

export const data: Array<Location> = [{
  id: 1,
  name: 'Office 1',
  address: 'Kaisaniemenkatu 7',
  city: 'Helsinki',
  postalCode: '56700',
  phoneNumber: '0401234567',
  email: 'office.1@outlook.fi'

},
{
  id: 2,
  name: 'Office 2',
  address: 'Eino Leinon katu 17',
  city: 'Tampere',
  postalCode: '56700',
  phoneNumber: '0509876543',
  email: 'office.2@outlook.fi'

},
{
  id: 3,
  name: 'Office 3',
  address: 'Sibeliuksenkatu 3',
  city: 'Turku',
  postalCode: '56700',
  phoneNumber: '0453217890',
  email: 'office.3@outlook.fi'

},
{
  id: 4,
  name: 'Office 4',
  address: 'Linnankoskentie 9',
  city: 'Helsinki',
  postalCode: '56700',
  phoneNumber: '0445678901',
  email: 'office.4@outlook.fi'

}];
// Exists solely to comply with sequelize api insert format - camelCase to sql native underscored columns
export const seedLocations = data.map(obj => {
  const { postalCode, phoneNumber, ...rest } = obj;
  return {
    postal_code: postalCode,
    phone_number: phoneNumber,
    ...rest
  };
});