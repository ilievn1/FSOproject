interface Props {
    isOpened: boolean;
    closeModal: () => void;
}

const FeedbackModal = ({ isOpened, closeModal }: Props) => {
    return (
        <>
            <dialog className={`modal ${isOpened ? 'modal-open' : ''} sm:modal-middle`}>
                <form onSubmit={() => { }} className="modal-box p-6 shadow-xl rounded-lg">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => closeModal()}>✕</button>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your name?</label>
                        <input type="text" placeholder="Name..." className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your phone number?</label>
                        <input type="text" placeholder="Number..." className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your inquery?</label>
                        <input type="text" placeholder="..." className="input input-bordered w-full" />
                    </div>
                    <button type="submit" className="btn btn-success w-full">Submit</button>
                </form>
            </dialog>
        </>
    )
}

export default FeedbackModal