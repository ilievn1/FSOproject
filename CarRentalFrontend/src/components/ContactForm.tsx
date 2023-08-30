import { useForm } from "react-hook-form";
import { ContactFormValues, Inquery } from "../types";
import FormInput from "./FormInput";
import axios from "axios";


const ContactForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>();
    
    const sendInquiry = async (contactBody: Inquery): Promise<Inquery> => {
        const resp = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/inquiries`,contactBody);
        return resp.data
    }
    // "handleSubmit" validates inputs automatically
    const handleContact = async (data: ContactFormValues) => {
        console.log(data)
        const contactBody = { name: data.Name, phone: data.Phone, email: data.Email, inquery:data.Inquery}
        await sendInquiry(contactBody)
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit(handleContact)} className="p-6 shadow-xl rounded-lg basis-2/3">
                <h1 className="text-2xl font-semibold mb-4">Contact Us!</h1>

                <FormInput<ContactFormValues>
                    register={register}
                    inputLabel="Name"
                    inputType="text"
                    inputError={errors.Name}
                    validations={{ required: { value: true, message: "This field is required" }, maxLength: { value: 10, message: "This field is 10 characters at most" } }}

                />
                <FormInput<ContactFormValues>
                    register={register}
                    inputLabel="Phone"
                    inputType="text"
                    inputError={errors.Phone}
                    validations={
                        {
                            required: { value: true, message: "This field is required" },
                            maxLength: { value: 12, message: "This field is 12 characters at most" },
                            minLength: { value: 6, message: "This field is 6 characters at least" }
                        }}

                />
                <FormInput<ContactFormValues>
                    register={register}
                    inputLabel="Email"
                    inputType="text"
                    inputError={errors.Email}
                    validations={
                        {
                            required: { value: true, message: "This field is required" },
                            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i, message: ">This field is required and of format firstname@lastname.domain" }
                        }}

                />
                <FormInput<ContactFormValues>
                    register={register}
                    inputLabel="Inquery"
                    inputType="text"
                    inputError={errors.Inquery}
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