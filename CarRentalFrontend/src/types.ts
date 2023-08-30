export type Fuel = 'Diesel' | 'Petrol' | 'Hybrid';

export type Transmittion = 'Automatic' | 'Manual';

export type Seats = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9;

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

export interface LoginFormValues {
    "Username": string;
    "Password": string;
}
export interface RegisterFormValues {
    "Name": string;
    "Username": string;
    "Password": string;
}
export interface ContactFormValues {
    "Name": string;
    "Email": string;
    "Phone": string;
    "Inquery": string;
}
export interface FeedbackFormValues {
    "Rating": number;
    "Comment"?: string;
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

export interface Inquery {
    name: string;
    phone: string;
    email: string;
    inquery: string;
}