import { useLocation } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";

//1. User clicks on CarCard "Reserve" button (Card button is not associated with car ID, but with car brand + model + year, because we can have multiple cars of same model)
//2. Frontend hits backend with car brand + model + year /cars/name+model+year api point (probably query params, rather than path) 
//3. Backend hits database with details and based on availability responds with car entry with car Id, car name, etc... or error: none available
//4. Frontend has pop-up "All cars of this model are already rented" or takes him to RentPage.
const RentPage = () => {
    const { pathname } = useLocation();
    return (
        <>
            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={() => { }} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <h1 className="text-2xl font-semibold mb-4">Fill out rent form</h1>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your name?</label>
                        <input type="text" placeholder="Name..." className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your email?</label>
                        <input type="text" placeholder="Email..." className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">What is your phone number?</label>
                        <input type="text" placeholder="Number..." className="input input-bordered w-full" />
                    </div>
                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Select pick-up location?</label>
                        <select className="select select-bordered w-full">
                            <option defaultChecked={true}>Office#1</option>
                            <option >Office#2</option>
                            <option >Office#3</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>
    )
}

export default RentPage