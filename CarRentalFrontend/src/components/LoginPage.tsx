import { SyntheticEvent, useState } from "react"
import { Link } from "react-router-dom"

const LoginPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = (event: SyntheticEvent) => {
        event.preventDefault()
        console.log('logging in with', username, password)
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleLogin} className="p-6 shadow-xl rounded-lg basis-2/3">
                <div className="mb-4 form-control w-full">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input className="input input-bordered w-full" />
                </div>
                <div className="mb-4 form-control w-full">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" className="input input-bordered w-full" />
                </div>
                <div className="mb-4">
                    <i>Don't have an account? </i>
                    <Link to="/register">Register</Link>
                </div >

                <button type="submit" className="btn btn-primary w-full">Submit</button>
            </form>
        </div>
    )
}


export default LoginPage