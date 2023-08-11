import { useState } from 'react'
import FeedbackModal from './FeedbackModal.tsx';
import Breadcrumbs from './Breadcrumbs.tsx';
import { useLocation } from 'react-router-dom';


// TODO: as many collapse elements as active reservations User.reservations.map(...)
// TODO: remove feedback btn when feedback for corresponding reservation ID has been given 
const ReservationPage = () => {
    const { pathname } = useLocation();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
    };
    return (
        <>
            <Breadcrumbs currentRoute={pathname} />
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