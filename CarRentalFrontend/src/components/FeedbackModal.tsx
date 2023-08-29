import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FeedbackFormValues } from "../types";

const MAX_RATING = 5;

interface Props {
    customerId: number
    reservationId: number
    isOpened: boolean;
    closeModal: () => void;
}

const FeedbackModal = ({ customerId, reservationId, isOpened, closeModal }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FeedbackFormValues>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [rating, setRating] = useState(1);
    const queryClient = useQueryClient();

    const giveReservationFeedback = async ({ customerId, reservationId, feedbackBody }: { customerId: number, reservationId: number, feedbackBody: FeedbackFormValues }): Promise<Reservation> => {
        const postUrl = `http://localhost:3001/api/customers/${customerId}/reservations/${reservationId}`
        const resp = await axios.post(postUrl, feedbackBody, { withCredentials: true })
        return resp.data
    }

    const feedbackMutation = useMutation({
        mutationFn: giveReservationFeedback,
        onSuccess: () => {
            // TODO: Invalidate or refetch???
            queryClient.invalidateQueries(['reservations']);
        },
    });

    
    
    // "handleSubmit" validates inputs automatically
    const handleFeedback = async (data: FeedbackFormValues) => {
        console.log(data);
        await feedbackMutation.mutateAsync({ customerId: customerId, reservationId: reservationId, feedbackBody: data });
        closeModal();
    }

    return (
        <>
            <dialog className={`modal ${isOpened ? 'modal-open' : ''} sm:modal-middle`}>
                <form onSubmit={handleSubmit(handleFeedback)} className="modal-box p-6 shadow-xl rounded-lg">
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
                        {/* <textarea ref={commentRef} className="textarea textarea-bordered h-24"></textarea> */}
                        <textarea className="textarea textarea-bordered h-24" {...register("Comment", {maxLength: 255, pattern: /[A-Za-z0-9 _.,!"'/$]*/i})} />
                        {errors.Comment
                            ? (<span role="alert">{errors.Comment.message}</span>)
                            : null
                        }
                    </div>
                    <button type="submit" className="btn btn-success w-full">Submit</button>
                </form>
            </dialog>
        </>
    )
}

export default FeedbackModal