import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {  Customer } from '../types';
import { SyntheticEvent, useMemo } from 'react';
import vehicleService from '../services/vehicle'
import reservationService from '../services/reservation'

const RentPage = () => {
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();

    const queryClient = useQueryClient();

    const [brand, model, year] = useMemo(() => {
        const brandValue = searchParams.get('brand')
        const modelValue = searchParams.get('model')
        const yearValue = searchParams.get('year')

        return [brandValue, modelValue, yearValue];
    }, [searchParams]);

    // In reality params can be null. Parameter integrity checking delegated to server
    const rentVehicleQuery = useQuery({ queryKey: ['rentVehicle'], queryFn: () => vehicleService.getRentVehicle(brand!, model!, year!) })
    
    const mutation = useMutation({
        mutationFn: reservationService.postCustomerReservation,
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