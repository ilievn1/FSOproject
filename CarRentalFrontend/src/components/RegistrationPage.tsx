import { SyntheticEvent, useState } from "react"
import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";


// TODO: Add dynamic error tooltips/labels beneath the field for wrong password, taken/wrong username
const RegistrationPage = () => {
    const { pathname } = useLocation();

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault()
        console.log('registering with', name, username, password)
    }
    return (
        <>

            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input type="password" className="input input-bordered w-full" />
                    </div>

                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>

    )
}

export default RegistrationPage