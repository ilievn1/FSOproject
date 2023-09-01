export type Fuel = 'Diesel' | 'Petrol' | 'Hybrid';

export type Transmittion = 'Automatic' | 'Manual';

export type Seats = 2 | 4 | 5 | 7 | 9;

export type Rating = 1 | 2 | 3 | 4 | 5;


export interface Vehicle {
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
    licenceNumber: string;
    available: boolean;
}

export interface Inquiry {
    name: string;
    email: string;
    phone: string;
    inquiry: string;
}

export interface Feedback {
    rating: Rating;
    comment?: string;
}

export interface Reservation {
    id: number;
    vehicle: Vehicle;
    startAt: string;
    endAt?: string;
    feedback?: Feedback
}

export interface Customer {
    id: number;
    googleId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
}

export interface Location {
    id: number;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phoneNumber: string;
    email: string;
}