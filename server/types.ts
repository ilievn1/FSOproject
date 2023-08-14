export type Fuel = 'Diesel' | 'Petrol' | 'Hybrid';

export type Transmittion = 'Automatic' | 'Manual';

export type Seats = 2 | 3 | 4 | 5 | 6 | 8 | 9;

export type Rating = 1 | 2 | 3 | 4 | 5;


export interface Car {
    id: number;
    carImage: string;
    brand: string;
    model: string;
    year: number;
    fuel: Fuel;
    transmittion: Transmittion;
    engine: string;
    fuelEfficiencyCity: number;
    fuelEfficiencyHighway: number;
    seats: Seats;
    rentPrice: number;
    rating: Rating;
}

export interface LoginFormValues {
    'Username': string;
    'Password': string;
}
export interface RegisterFormValues {
    'Name': string;
    'Username': string;
    'Password': string;
}
export interface ContactFormValues {
    'Name': string;
    'Email': string;
    'Phone': string;
    'Inquery': string;
}