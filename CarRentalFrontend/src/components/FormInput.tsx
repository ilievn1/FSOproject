import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";


type InputProps<T extends FieldValues> = {
    register: UseFormRegister<T>;
    validations?: RegisterOptions<T, Path<T>>
    inputLabel: Capitalize<Path<T>>;
    inputType: "text" | "password";
    inputError: FieldError | undefined;

};

const FormInput = <T extends FieldValues>({ inputLabel, inputType, inputError, register, validations }: InputProps<T>) => {
    const inputName = inputLabel.toLowerCase() as Path<T>;
    return (
        <div className="mb-4 form-control w-full">
            <label className="block text-sm font-medium mb-1">{inputLabel}</label>
            <input
                type={inputType}
                {...register(inputName, validations )}
                aria-invalid={inputError ? "true" : "false"}
                className="input input-bordered w-full" />
            {inputError
                ? (<span role="alert">{inputError.message}</span>)
                : null
            }
        </div>
    )
}

export default FormInput