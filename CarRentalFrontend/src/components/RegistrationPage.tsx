import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useForm } from "react-hook-form";
import { RegisterFormValues } from "../types";
import { useEffect } from 'react';
import FormInput from './FormInput';

// TODO: Add dynamic error tooltips/labels beneath the field for wrong password, taken/wrong Username
const RegistrationPage = () => {
    const { pathname } = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>();

    useEffect(() => {
        register("Name", { required: { value: true, message: "This field is required" } })
        register("Username", { required: { value: true, message: "This field is required" }, maxLength: { value: 10, message: "This field is 10 characters at most" } })
        register("Password", { required: { value: true, message: "This field is required" }, minLength: { value: 10, message: "This field is 5 characters at least" } })
    }, [register]);

    // "handleSubmit" validates inputs automatically
    const handleRegister = async (data: RegisterFormValues) => {
        console.log('data',data)
        if (data.Username === "bill") {
            alert(JSON.stringify(data));
        } else {
            alert("There is an error");
        }
    };


    return (
        <>

            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={handleSubmit(handleRegister)} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            aria-invalid={errors.Name ? "true" : "false"}
                            className="input input-bordered w-full" />
                        {errors.Name
                            ? (<span role="alert">This field is required</span>)
                            : null
                        }
                    </div>

                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            aria-invalid={errors.Username ? "true" : "false"}
                            className="input input-bordered w-full" />
                        {errors.Username
                            ? (<span role="alert">This field is required and of maximum length 10 characters</span>)
                            : null
                        }
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            aria-invalid={errors.Password ? "true" : "false"}
                            className="input input-bordered w-full" />
                        {errors.Password
                            ? (<span role="alert">This field is required and of minimum length 5 characters</span>)
                            : null
                        }
                    </div>


                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>

    )
}

export default RegistrationPage