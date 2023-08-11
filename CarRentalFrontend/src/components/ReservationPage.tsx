import { useState } from 'react'
import FeedbackModal from './FeedbackModal.tsx';
import { Link } from 'react-router-dom';
// TODO: as many collapse elements as active reservations User.reservations.map(...)
// TODO: remove feedback btn when feedback for corresponding reservation ID has been given 
const ReservationPage = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
    };
    return (
        <>
            <div className="text-sm breadcrumbs">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/reservations">Reservations</Link></li>
                </ul>
            </div>
            <div className="collapse bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                    reservation ID, Car, Reservation date
                </div>
                <div className="collapse-content">
                    <p>hello</p>
                    <button className='btn' onClick={() => openModal()}>Feedback</button>
                </div>
            </div>
            <FeedbackModal isOpened={modalOpen} closeModal={closeModal} />
        </>
    )
}

export default ReservationPage