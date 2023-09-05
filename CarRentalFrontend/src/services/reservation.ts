
import axios from 'axios'
import { Feedback, NewReservation, Reservation } from '../types';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/customers`

const getCustomerReservations = async (customerId: number): Promise<Reservation[]> => {
    const resp = await axios.get(`${baseUrl}/${customerId}/reservations`, { withCredentials: true })
    return resp.data
}

const postCustomerReservation = async ({ brand, year, model, customerId, rentDate, pickUpLocationId, returnDate, dropOffLocationId }: NewReservation): Promise<Reservation> => {
    const postUrl = `${baseUrl}/${customerId}/reservations`
    const resp = await axios.post(postUrl, { brand, year, model, rentDate, pickUpLocationId, returnDate, dropOffLocationId }, { withCredentials: true })
    return resp.data
}

const deleteReservationForCustomer = async ({ customerId, reservationId, }: { customerId: number, reservationId: number }) => {
    const deleteUrl = `${baseUrl}/${customerId}/reservations/${reservationId}`
    const resp = await axios.delete(deleteUrl, { withCredentials: true })
    return resp.data
}

const giveReservationFeedback = async ({ customerId, reservationId, feedbackBody }: { customerId: number, reservationId: number, feedbackBody: Feedback }): Promise<Feedback> => {
    const postUrl = `${baseUrl}/${customerId}/reservations/${reservationId}/feedback`
    const resp = await axios.post(postUrl, feedbackBody, { withCredentials: true })
    return resp.data
}

export default {
    getCustomerReservations, postCustomerReservation, deleteReservationForCustomer, giveReservationFeedback
}