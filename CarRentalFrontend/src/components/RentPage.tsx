import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";


const RentPage = () => {
    const { pathname } = useLocation();
    return (
        <>
            <Breadcrumbs currentRoute={pathname} />

            <ul className="steps">
                <li className="step step-primary">Register</li>
                <li className="step step-primary">Choose plan</li>
                <li className="step">Purchase</li>
                <li className="step">Receive Product</li>
            </ul>
            <div className="flex justify-center">
                <form onSubmit={() => { }} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <h1 className="text-2xl font-semibold mb-4">Contact Us!</h1>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your name?</label>
                        <input type="text" placeholder="Name..." className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your phone number?</label>
                        <input type="text" placeholder="Number..." className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your inquery?</label>
                        <input type="text" placeholder="..." className="input input-bordered w-full" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>
    )
}

export default RentPage