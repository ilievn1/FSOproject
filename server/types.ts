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
    reservations?: Reservation[];
}
export interface Customer {
    id: number;
    googleId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
}

export interface Inquiry {
    id: number;
    name: string;
    phone: string;
    email: string;
    inquiry: string;
}
export interface Feedback {
    id: number;
    reservationId: number;
    rating: Rating;
    comment?: string;
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

export interface Reservation {
    id: number;
    customerId: number;
    vehicleId: number;
    rentDate: string;
    pickUpLocation: Location
    returnDate: string;
    dropOffLocation: Location
    feedback?: Feedback
}
export interface DateRange
{
    rentDate: string;
    returnDate: string;
}
export type NewReservation = Omit<Reservation, 'id' | 'feedback' | 'pickUpLocation' | 'dropOffLocation'> & { pickUpLocationId: number } & { dropOffLocationId: number };
export type NewInquiry = Omit<Inquiry, 'id'>;
export type NewFeedback = Omit<Feedback, 'id'>;