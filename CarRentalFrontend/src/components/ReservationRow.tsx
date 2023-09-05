import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { Customer, Reservation } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import reservationService from '../services/reservation'


const ReservationRow = ({ reservation }: { reservation: Reservation }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
  };

  const queryClient = useQueryClient();

  const customer: Customer = queryClient.getQueryData(['customer'])!

  const deleteReservationMutation = useMutation({
    mutationFn: reservationService.deleteReservationForCustomer,
    onSuccess: (_, mutateParams) => {
      queryClient.setQueryData(['reservations'], (oldData: Array<Reservation> | undefined) => {
        return oldData ? oldData.filter((reservation) => reservation.id !== mutateParams.reservationId) : undefined;
      });
    },
    onError: (error) => {
      window.alert(`Error deleting reservation: \n${error}`);
      console.error("Error deleting reservation:", error);
    },
  });

  const handleDelete = async () => {
    await deleteReservationMutation.mutateAsync({ customerId: customer.id, reservationId: reservation.id });
  }
  const isTodayAfterReturnDate = (): boolean => {
    return new Date(reservation.returnDate) <= new Date();
  }
  return (
    <>
      <tr>
        <th>{reservation.vehicle.licenceNumber}</th>
        <td>{reservation.vehicle.brand}</td>
        <td>{reservation.vehicle.model}</td>
        <td>{reservation.vehicle.year}</td>
        <td>{reservation.rentDate}</td>
        <td>{reservation.pickUpLocation.name}</td>
        <td>{reservation.returnDate}</td>
        <td>{reservation.dropOffLocation.name}</td>
        <td>{isTodayAfterReturnDate() ? (<button className='btn btn-success' onClick={() => openModal()}>Feedback</button>) : null}</td>
        <td>{isTodayAfterReturnDate() ? (<button className="btn btn-error" onClick={handleDelete}>Delete</button>) : null}</td>
      </tr>
      <FeedbackModal reservationId={reservation.id} customerId={customer.id} isOpened={modalOpen} closeModal={closeModal} />
    </>
  )
}

export default ReservationRow