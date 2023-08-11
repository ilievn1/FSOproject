import { useState,useRef } from "react";

const MAX_RATING = 5;

interface Props {
    isOpened: boolean;
    closeModal: () => void;
}

const FeedbackModal = ({ isOpened, closeModal }: Props) => {
    const [rating, setRating] = useState(1);
    const comment = useRef<HTMLTextAreaElement>(null);

    return (
        <>
            <dialog className={`modal ${isOpened ? 'modal-open' : ''} sm:modal-middle`}>
                <form onSubmit={() => { }} className="modal-box p-6 shadow-xl rounded-lg">
                    <h3 className="font-bold text-lg">Tell us about your experience!</h3>
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => closeModal()}>✕</button>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Rate your experience</label>
                        <li className="rating">
                            {Array.from({ length: MAX_RATING }, (_, index) => {
                                index += 1;
                                return (
                                    <input key={index} type="radio" name="rating-1" className="mask mask-star-2 bg-yellow-400" onChange={() => setRating(index)} />
                                )
                             })
                                
                            }
                        </li>
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="label label-text">Additional comment</label>
                        <textarea ref={comment} className="textarea textarea-bordered h-24"></textarea>
                    </div>
                    <button type="submit" className="btn btn-success w-full">Submit</button>
                </form>
            </dialog>
        </>
    )
}

export default FeedbackModal