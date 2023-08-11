import { useForm } from "react-hook-form";
import { ContactFormValues } from "../types";
import { useEffect } from 'react';


const ContactForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>();
    useEffect(() => {
        register("name", { required: true })
        register("phone", { required: true, minLength: 6, maxLength: 12 })
        register("email", { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i })
        register("inquery", { required: true, minLength: 10 })
    }, [register]);

    const handleContact = handleSubmit(data => {
        console.log(data)
    });
    
    return (
        <div className="flex justify-center">
            <form onSubmit={handleContact} className="p-6 shadow-xl rounded-lg basis-2/3">
                <h1 className="text-2xl font-semibold mb-4">Contact Us!</h1>
                <div className="mb-4 form-control w-full">
                    <label className="block text-sm font-medium mb-1">What is your name?</label>
                    <input
                        placeholder="Name..."
                        aria-invalid={errors.name ? "true" : "false"}
                        className="input input-bordered w-full" />

                    {errors.name
                        ? (<span role="alert">This field is required</span>)
                        : null
                    }
                </div>
                <div className="mb-4 form-control w-full">
                    <label className="block text-sm font-medium mb-1">What is your phone number?</label>
                    <input
                        placeholder="Number..."
                        aria-invalid={errors.phone ? "true" : "false"}
                        className="input input-bordered w-full" />
                    
                    {errors.phone
                        ? (<span role="alert">This field is required and with length between 6 and 12 characters</span>)
                        : null
                    }
                </div>
                <div className="mb-4 form-control w-full">
                    <label className="block text-sm font-medium mb-1">What is your email?</label>
                    <input
                        placeholder="Email..."
                        aria-invalid={errors.email ? "true" : "false"}
                        className="input input-bordered w-full" />
                    
                    {errors.email
                        ? (<span role="alert">This field is required and of format <i>firstname@lastname.domain</i></span>)
                        : null
                    }
                </div>
                <div className="mb-4 form-control w-full">
                    <label className="block text-sm font-medium mb-1">What is your inquery?</label>
                    <input
                        placeholder="..."
                        aria-invalid={errors.inquery ? "true" : "false"}
                        className="input input-bordered w-full" />
                    {errors.inquery
                        ? (<span role="alert">This field is required and of minimum length 10 characters</span>)
                        : null
                    }
                </div>
                <button type="submit" className="btn btn-primary w-full">Submit</button>
            </form>
        </div>)
}

export default ContactForm