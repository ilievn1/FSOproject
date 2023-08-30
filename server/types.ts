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
export interface Customer {
    id: number;
    googleId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
}

export interface Inquery {
    id: number;
    name: string;
    phone: string;
    email: string;
    inquery: string;
}
export interface Feedback {
    id: number;
    reservationId: number;
    rating: Rating;
    comment?: string;
}
export interface Reservation {
    id: number;
    customerId: number;
    vehicleId: number;
    startAt: string;
    endAt: string;
    feedback?: Feedback
}

export type NewCustomer = Omit<Customer, 'id' | 'hashedPassword'> & { password: Customer['hashedPassword'] }
export type NewReservation = Omit<Reservation, 'id' | 'endAt' | 'feedback'>;
export type NewFeedback = Omit<Feedback, 'id'>;