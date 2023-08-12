import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useForm } from "react-hook-form";
import { RegisterFormValues } from "../types";
import FormInput from './FormInput';
import { useEffect, useState } from 'react';

interface PasswordStrength {
    score: number;
    feedback: string;
    color: string;
}

const checkPasswordStrength = (password?: string): PasswordStrength | null => {
    let score = 0;
    let feedback = "";
    let color = "";
    if (!password || password.length < 5) {
        return null;
    }
    password.length >= 5 ? score += 20 : 0;
    /[A-Z]/.test(password) ? score += 20 : 0;
    /[a-z]/.test(password) ? score += 20 : 0;
    /\d/.test(password) ? score += 20 : 0;
    /[$@$!%*?&]/.test(password) ? score += 20 : 0;


    switch (score) {
        case 20:
            feedback = "Very Weak";
            color = 'progress-error';
            break;
        case 40:
            feedback = "Weak";
            color = 'progress-warning';
            break;
        case 60:
            feedback = "Moderate";
            color = 'progress-info';
            break;
        case 80:
            feedback = "Strong";
            color = 'progress-accent';
            break;
        case 100:
            feedback = "Very Strong";
            color = 'progress-success';
            break;
        default:
            feedback = "";
    }

    return { score, feedback, color };
}

const RegistrationPage = () => {
    const { pathname } = useLocation();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>();
    const [passwordStrength, SetPasswordStrength] = useState<PasswordStrength | null>(null)

    useEffect(() => {
        const subscription = watch((field) => {
            const res = checkPasswordStrength(field.Password)
            SetPasswordStrength(res)
        })
        return () => subscription.unsubscribe()
    }, [watch])

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
                <form onSubmit={handleSubmit(handleRegister)} className="p-6 shadow-xl rounded-lg basis-1/3">
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
                    {
                        passwordStrength
                            ? (
                                <div>
                                    <progress className={`progress w-full ${passwordStrength.color}`} value={passwordStrength.score} max="100">KKK</progress>
                                    <i>{passwordStrength.feedback}</i>
                                </div>
                            )
                            : null
                    }

                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>

    )
}

export default RegistrationPage