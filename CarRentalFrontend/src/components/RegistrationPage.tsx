import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useForm } from "react-hook-form";
import { RegisterFormValues } from "../types";
import FormInput from './FormInput';

// TODO: Add dynamic error tooltips/labels beneath the field for wrong password, taken/wrong Username
const RegistrationPage = () => {
    const { pathname } = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>();

    // "handleSubmit" validates inputs automatically
    const handleRegister = async (data: RegisterFormValues) => {
        console.log('data', data)
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
                    <FormInput<RegisterFormValues>
                        register={register}
                        inputLabel="Name"
                        inputType="text"
                        inputError={errors.Name}
                        validations={undefined}
                    />
                    <FormInput<RegisterFormValues>
                        register={register}
                        inputLabel="Username"
                        inputType="text"
                        inputError={errors.Username}
                        validations={{ required: { value: true, message: "This field is required" }, maxLength: { value: 10, message: "This field is 10 characters at most" } }}

                    />
                    <FormInput<RegisterFormValues>
                        register={register}
                        inputLabel="Password"
                        inputType="password"
                        inputError={errors.Password}
                        validations={{ required: { value: true, message: "This field is required" }, minLength: { value: 5, message: "This field is 5 characters at least" } }}
                    />
                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>

    )
}

export default RegistrationPage