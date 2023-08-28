import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { Reservation } from "../types";


const ReservationRow = ({ reservation }: { reservation: Reservation }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
  };
  return (
    <div>
      <p> {reservation.vehicle.brand} {reservation.vehicle.model} {reservation.vehicle.year} / {reservation.startAt} - {reservation.endAt}</p>
      {
        /* TODO: handle delete via .post and invalidation*/
      }
      <button className='btn' onClick={() => openModal()}>Feedback</button>
      {
        /* TODO: handle delete via .delete and invalidation*/
      }
      <button className="btn btn-error">Delete</button>

      <FeedbackModal isOpened={modalOpen} closeModal={closeModal} />
    </div>
  )
}

export default ReservationRow