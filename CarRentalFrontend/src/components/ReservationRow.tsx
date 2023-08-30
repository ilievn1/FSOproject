import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { Customer, Reservation } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';


const ReservationRow = ({ index,reservation }: { index:number, reservation: Reservation }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
  };

  const queryClient = useQueryClient();

  // const giveReservationFeedback = async ({ customerId, vehicleId }: { customerId: number, vehicleId: number }): Promise<Reservation> => {
  //   const postUrl = `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/reservations`
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
    const patchUrl = `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/reservations/${reservationId}`
    const resp = await axios.patch(patchUrl, { endAt: new Date().toJSON().slice(0, 10) }, { withCredentials: true });
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
    <>
      <tr>
        <th>{index}</th>
        <td>{reservation.vehicle.brand}</td>
        <td>{reservation.vehicle.model}</td>
        <td>{reservation.vehicle.year}</td>
        <td>{reservation.startAt}</td>
        <td>{reservation.endAt}</td>
        <td>Pick-up Location</td>
        <td>Drop-off Location</td>
        <td>{reservation.endAt ? null : (<button className="btn btn-error" onClick={handleEnd}>End</button>)}</td>
        <td>{reservation.feedback ? null : (<button className='btn' onClick={() => openModal()}>Feedback</button>)}</td>
      </tr>
      <FeedbackModal reservationId={reservation.id} customerId={customer.id} isOpened={modalOpen} closeModal={closeModal} />
    </>
  )
}

export default ReservationRow