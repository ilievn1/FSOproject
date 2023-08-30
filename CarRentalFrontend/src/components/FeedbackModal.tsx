import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Feedback, Rating } from "../types";
import FormInput from "./FormInput";
import reservationService from '../services/reservation'

const MAX_RATING = 5;

interface Props {
    customerId: number
    reservationId: number
    isOpened: boolean;
    closeModal: () => void;
}

const FeedbackModal = ({ customerId, reservationId, isOpened, closeModal }: Props) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Feedback>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [rating, setRating] = useState<Rating>(1);
    const queryClient = useQueryClient();

    const feedbackMutation = useMutation({
        mutationFn: reservationService.giveReservationFeedback,
        onSuccess: () => {
            // TODO: Invalidate or refetch???
            queryClient.invalidateQueries(['reservations']);
        },
    });
    
    // "handleSubmit" validates inputs automatically
    const handleFeedback = async (validatedData: Feedback) => {
        reset();
        await feedbackMutation.mutateAsync({ customerId: customerId, reservationId: reservationId, feedbackBody: { rating: rating, comment: validatedData.comment  } });
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
                                    <input key={index} type="radio" name="rating-1" className="mask mask-star-2 bg-yellow-400" onChange={() => setRating(index as Rating)} />
                                )
                            })

                            }
                        </li>
                    </div>
                    <div className="mb-4 form-control w-full">
                        <FormInput<Feedback>
                        register={register}
                            inputLabel="Comment"
                            inputType="text"
                            inputError={errors.comment}
                            validations={{ maxLength: { value: 255, message: "This field is 255 characters at most" }, pattern: { value: /[A-Za-z0-9 _.,!"'/$]*/i , message: 'Only alphanumerics and punctuation signs allowed' } }}

                        />
                    </div>
                    <button type="submit" className="btn btn-success w-full">Submit</button>
                </form>
            </dialog>
        </>
    )
}

export default FeedbackModal