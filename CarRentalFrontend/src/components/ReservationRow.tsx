import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { Customer, Reservation } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';


const ReservationRow = ({ reservation }: { reservation: Reservation }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
  };

  const queryClient = useQueryClient();

  // const giveReservationFeedback = async ({ customerId, vehicleId }: { customerId: number, vehicleId: number }): Promise<Reservation> => {
  //   const postUrl = `http://localhost:3001/api/customers/${customerId}/reservations`
  //   const resp = await axios.post(postUrl, { vehicleId }, { withCredentials: true })
  //   return resp.data
  // }
  // const feedbackMutation = useMutation({
  //   mutationFn: giveReservationFeedback,
  //   onSuccess: () => {
  //     // TODO: Invalidate or refetch???
  //     queryClient.invalidateQueries(['reservations']);
  //   },
  // });
  const customer: Customer = queryClient.getQueryData(['customer'])!

  const endReservation = async ({ customerId, reservationId }: { customerId: number, reservationId: number }): Promise<Reservation> => {
    const putUrl = `http://localhost:3001/api/customers/${customerId}/reservations/${reservationId}`
    const resp = await axios.patch(putUrl, { endAt: new Date().toJSON().slice(0, 10) }, { withCredentials: true });
    return resp.data
  }

  const endMutation = useMutation({
    mutationFn: endReservation,
    onSuccess: () => {
      // TODO: Invalidate or refetch???
      queryClient.invalidateQueries(['reservations']);
    },
  });

  const handleEnd = async () => {
    await endMutation.mutateAsync({ customerId: customer.id, reservationId: reservation.id });
  }

  return (
    <div>
      <p> {reservation.vehicle.brand} {reservation.vehicle.model} {reservation.vehicle.year} / {reservation.startAt} - {reservation.endAt}</p>

      {reservation.endAt ? null : (<button className="btn btn-error" onClick={handleEnd}>End</button>)}

      {reservation.feedback ? null : (<button className='btn' onClick={() => openModal()}>Feedback</button>)}

      <FeedbackModal reservationId={reservation.id} customerId={customer.id} isOpened={modalOpen} closeModal={closeModal} />
    </div>
  )
}

export default ReservationRow