import { Link } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useForm } from "react-hook-form";
import { LoginFormValues } from "../types";
import { useEffect } from "react";

const LoginPage = () => {
    const { pathname } = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

    useEffect(() => {
        register("username", { required: true, maxLength: 10 })
        register("password", { required: true, minLength: 5 })
    }, [register]);

    // "handleSubmit" validates inputs automatically
    const handleLogin = handleSubmit(data => {
        console.log(data)
    });

    return (
        <>
            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={handleLogin} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Username</label>
                        {/* register input into useForm hook by invoking the "register" function */}
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
                    <div className="mb-4">
                        <i>Don't have an account? </i>
                        <Link to="/register">Register</Link>
                    </div >

                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>)
}


export default LoginPage