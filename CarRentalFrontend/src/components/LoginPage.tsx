import { Link } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useForm } from "react-hook-form";
import { LoginFormValues } from "../types";
import FormInput from "./FormInput";

const LoginPage = () => {
    const { pathname } = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

    
    // "handleSubmit" validates inputs automatically
    const handleLogin = async (data: LoginFormValues) => {
        console.log(data)
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
                <form onSubmit={handleSubmit(handleLogin)} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <FormInput<LoginFormValues>
                        register={register}
                        inputLabel="Username"
                        inputType="text"
                        inputError={errors.Username}
                        validations={{ required: { value: true, message: "This field is required" }, maxLength: { value: 10, message: "This field is 10 characters at most" } }}

                    />
                    <FormInput<LoginFormValues>
                        register={register}
                        inputLabel="Password"
                        inputType="password"
                        inputError={errors.Password}
                        validations={{ required: { value: true, message: "This field is required" }, minLength: { value: 5, message: "This field is 5 characters at least" } }}
                    />
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