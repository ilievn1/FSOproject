import { FieldError, Path } from "react-hook-form";


type InputProps<T> = {
    inputLabel: Path<T>;
    inputType: "text" | "password";
    inputError: FieldError | undefined;

};

const FormInput = <T extends object>({ inputLabel, inputType, inputError }: InputProps<T>) => {
    console.log('inputError?.message',inputError?.message)
    return (
        <div className="mb-4 form-control w-full">
            <label className="block text-sm font-medium mb-1">{inputLabel}</label>
            <input
                type={inputType}
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