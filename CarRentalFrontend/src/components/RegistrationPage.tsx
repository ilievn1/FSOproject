import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useForm } from "react-hook-form";
import { RegisterFormValues } from "../types";
import { useEffect } from 'react';

// TODO: Add dynamic error tooltips/labels beneath the field for wrong password, taken/wrong username
const RegistrationPage = () => {
    const { pathname } = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>();

    useEffect(() => {
        register("name", { required: true })
        register("username", { required: true, maxLength: 10 })
        register("password", { required: true, minLength: 5 })
    }, [register]);

    const handleRegister = handleSubmit(data => {
        console.log(data)
    });


    return (
        <>

            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={handleRegister} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            aria-invalid={errors.name ? "true" : "false"}
                            className="input input-bordered w-full" />
                        {errors.name
                            ? (<span role="alert">This field is required</span>)
                            : null
                        }
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            aria-invalid={errors.username ? "true" : "false"}
                            className="input input-bordered w-full" />
                        {errors.username
                            ? (<span role="alert">This field is required and of maximum length 10 characters</span>)
                            : null
                        }
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            aria-invalid={errors.password ? "true" : "false"}
                            className="input input-bordered w-full" />
                        {errors.password
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