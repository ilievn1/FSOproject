import { useState } from 'react'
import FeedbackModal from './FeedbackModal.tsx';

const ReservationPage = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
    };
    return (
        <>
            <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" />
                <div className="collapse-title text-xl font-medium">
                    Click to open this one and close others
                </div>
                <div className="collapse-content">
                    <p>hello</p>
                </div>
            </div>
            <FeedbackModal isOpened={modalOpen} closeModal={closeModal} />
            <button className='btn' onClick={() => openModal()}>open</button>
        </>
    )
}

export default ReservationPage