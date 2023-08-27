import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { Reservation } from "../types";


const ReservationCollapseble = ({reservation}:{reservation: Reservation}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
  };
  return (
    <>
      <div className="collapse bg-base-200">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          <p> {reservation.vehicle.brand} {reservation.vehicle.model} {reservation.vehicle.year} / {reservation.startAt} - {reservation.endAt}</p>
        </div>
        <div className="collapse-content">
          <p>hello</p>
          {
            /* TODO: handle delete via .post and invalidation*/
          }
          <button className='btn' onClick={() => openModal()}>Feedback</button>
          {
            /* TODO: handle delete via .delete and invalidation*/
          }
          <button className="btn btn-error">Delete</button>
        </div>
      </div>
      <FeedbackModal isOpened={modalOpen} closeModal={closeModal} />
    </>
  )
}

export default ReservationCollapseble