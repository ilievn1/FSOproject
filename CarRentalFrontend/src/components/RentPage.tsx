import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {  Customer, Reservation, Vehicle } from '../types';
import { SyntheticEvent } from 'react';

//1. User clicks on CarCard "Reserve" button (Card button is not associated with car ID, but with car brand + model + year, because we can have multiple cars of same model)
//2. Frontend hits backend with car brand + model + year /cars/name+model+year api point (probably query params, rather than path) 
//3. Backend hits database with details and based on availability responds with car entry with car Id, car name, etc... or error: none available
//4. Frontend has pop-up "All cars of this model are already rented" or takes him to RentPage.
const RentPage = () => {
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();

    const queryClient = useQueryClient();

    const getVehicle = async (): Promise<Vehicle | undefined> => {
        const brand = searchParams.has('brand') ? searchParams.get('brand') : null
        const model = searchParams.has('model') ? searchParams.get('model') : null
        const year = searchParams.has('year') ? searchParams.get('year') : null
        const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles?brand=${brand}&model=${model}&year=${year}`, { withCredentials: true });
        if (resp.status === 404) {
            return undefined
        }
        return resp.data
    }
    const rentVehicleQuery = useQuery({
        queryKey: ['rentVehicle'],
        queryFn: getVehicle,
    })
    
    const postReservation = async ({ customerId, vehicleId }: { customerId: number, vehicleId: number }): Promise<Reservation> => {
        const postUrl = `${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/reservations`
        const resp = await axios.post(postUrl, { vehicleId: vehicleId },{ withCredentials: true })
        return resp.data
    }
    const mutation = useMutation({
        mutationFn: postReservation,
        onSuccess: () => {
            // TODO: Invalidate or refetch???
            queryClient.invalidateQueries(['reservations']);
        },
    });
    
    if (rentVehicleQuery.isLoading) {
        return (<p>Fetching vehicle...</p>)
    }

    if (rentVehicleQuery.isError) {
        window.alert("All vehicles of selected model are reserved.\nPlease choose another vehicle.")
        navigate('/vehicles')
    }

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()

        const customer : Customer = queryClient.getQueryData(['customer'])!

        const vid = rentVehicleQuery.data?.id

        await mutation.mutateAsync({ customerId: customer.id, vehicleId: vid! });
        navigate('/reservations')
    }

    return (
        <>
            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="p-6 shadow-xl rounded-lg basis-2/3">
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