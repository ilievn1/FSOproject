import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { Customer, Reservation } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import reservationService from '../services/reservation'


const ReservationRow = ({ index,reservation }: { index:number, reservation: Reservation }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
  };

  const queryClient = useQueryClient();

  const customer: Customer = queryClient.getQueryData(['customer'])!

  const endMutation = useMutation({
    mutationFn: reservationService.endCustomerReservation,
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
        <td>Pick-up Location</td>
        <td>{reservation.endAt}</td>
        <td>Drop-off Location</td>
        <td>{reservation.endAt ? null : (<button className="btn btn-error" onClick={handleEnd}>End</button>)}</td>
        <td>{reservation.feedback ? null : (<button className='btn' onClick={() => openModal()}>Feedback</button>)}</td>
      </tr>
      <FeedbackModal reservationId={reservation.id} customerId={customer.id} isOpened={modalOpen} closeModal={closeModal} />
    </>
  )
}

export default ReservationRow