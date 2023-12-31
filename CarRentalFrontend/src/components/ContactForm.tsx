import { useForm } from "react-hook-form";
import { Inquiry } from "../types";
import FormInput from "./FormInput";
import inquiryService from '../services/inquiry'


const ContactForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Inquiry>();
    
    // "handleSubmit" validates inputs automatically
    const handleContact = async (data: Inquiry) => {
        reset();
        await inquiryService.sendInquiry(data)
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit(handleContact)} className="p-6 shadow-xl rounded-lg basis-2/3">
                <h1 className="text-2xl font-semibold mb-4">Contact Us!</h1>

                <FormInput<Inquiry>
                    register={register}
                    inputLabel="Name"
                    inputType="text"
                    inputError={errors.name}
                    validations={{ required: { value: true, message: "This field is required" }, maxLength: { value: 30, message: "This field is 30 characters at most" } }}

                />
                <FormInput<Inquiry>
                    register={register}
                    inputLabel="Phone"
                    inputType="text"
                    inputError={errors.phone}
                    validations={
                        {
                            required: { value: true, message: "This field is required" },
                            maxLength: { value: 13, message: "This field is 13 characters at most" },
                            minLength: { value: 10, message: "This field is 10 characters at least" }
                        }}

                />
                <FormInput<Inquiry>
                    register={register}
                    inputLabel="Email"
                    inputType="text"
                    inputError={errors.email}
                    validations={
                        {
                            required: { value: true, message: "This field is required" },
                            pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i, message: ">This field is required and of format firstname@lastname.domain" }
                        }}

                />
                <FormInput<Inquiry>
                    register={register}
                    inputLabel="Inquiry"
                    inputType="text"
                    inputError={errors.inquiry}
                    validations={
                        {
                            required: { value: true, message: "This field is required" },
                            minLength: { value: 6, message: "This field is 6 characters at least" }
                        }}

                />
                <button type="submit" className="btn btn-primary w-full">Submit</button>
            </form>
        </div>)
}

export default ContactForm