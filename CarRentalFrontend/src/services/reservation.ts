
import axios from 'axios'
import { Feedback, Reservation } from '../types';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/customers`

const getCustomerReservations = async (customerId: number): Promise<Reservation[]> => {
    const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/reservations`, { withCredentials: true })
    return resp.data
}

const postCustomerReservation = async ({ customerId, vehicleId }: { customerId: number, vehicleId: number }): Promise<Reservation> => {
    const postUrl = `${baseUrl}/${customerId}/reservations`
    const resp = await axios.post(postUrl, { vehicleId: vehicleId }, { withCredentials: true })
    return resp.data
}

const endCustomerReservation = async ({ customerId, reservationId }: { customerId: number, reservationId: number }): Promise<Reservation> => {
    const patchUrl = `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/reservations/${reservationId}`
    const resp = await axios.patch(patchUrl, { endAt: new Date().toJSON().slice(0, 10) }, { withCredentials: true });
    return resp.data
}

const giveReservationFeedback = async ({ customerId, reservationId, feedbackBody }: { customerId: number, reservationId: number, feedbackBody: Feedback }): Promise<Feedback> => {
    const postUrl = `${baseUrl}/${customerId}/reservations/${reservationId}/feedback`
    const resp = await axios.post(postUrl, feedbackBody, { withCredentials: true })
    return resp.data
}

export default {
    getCustomerReservations, postCustomerReservation, endCustomerReservation, giveReservationFeedback
}