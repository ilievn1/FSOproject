import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Customer } from '../types';
import { SyntheticEvent, useMemo, useRef } from 'react';
import vehicleService from '../services/vehicle'
import reservationService from '../services/reservation'
import locationService from '../services/location'
const TODAY = new Date().toISOString().split('T')[0];

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
    const locationsQuery = useQuery(['locations'], locationService.getAll)

    const rentDateRef = useRef<HTMLInputElement>(null);
    const returnDateRef = useRef<HTMLInputElement>(null);
    const pickUpLocationRef = useRef<HTMLSelectElement>(null);
    const dropOffLocationRef = useRef<HTMLSelectElement>(null);

    const mutation = useMutation({
        mutationFn: reservationService.postCustomerReservation,
        onSuccess: () => {
            // TODO: Invalidate or refetch???
            queryClient.invalidateQueries(['reservations']);
        },
    });

    if (rentVehicleQuery.isLoading || locationsQuery.isLoading) {
        return (<p>Fetching data...</p>)
    }

    if (rentVehicleQuery.isError) {
        window.alert("All vehicles of selected model are reserved.\nPlease choose another vehicle.")
        navigate('/vehicles')
    }
    if (locationsQuery.isError) {
        return (<p>Error fetching locations...</p>)
    }

    const setMinAndMaxDates = () => {
        if (rentDateRef.current && returnDateRef.current) {
            if (rentDateRef.current.value === "" && returnDateRef.current.value === "") {
                console.log('#1111')
                rentDateRef.current.min = TODAY;
                rentDateRef.current.max = "";
                returnDateRef.current.min = TODAY;
                returnDateRef.current.max = "";

            } else if (rentDateRef.current.value !== "" && returnDateRef.current.value !== "") {
                console.log('#2222')

                // Calculate the maximum return date (1 month from the rent date)
                const chosenRentDate = new Date(rentDateRef.current.value);
                console.log('🆁🅴🅽🆃 chosenRentDate', chosenRentDate.toISOString().split('T')[0])
                const maxReturnDate = new Date(chosenRentDate);
                maxReturnDate.setMonth(chosenRentDate.getMonth() + 1)
                console.log('🆁🅴🅽🆃 maxReturnDate', maxReturnDate.toISOString().split('T')[0])

                rentDateRef.current.min = TODAY;
                console.log('🆁🅴🅽🆃 set rentDateRef.current.min', TODAY)
                rentDateRef.current.max = returnDateRef.current.value;
                console.log('🆁🅴🅽🆃 set rentDateRef.current.max', returnDateRef.current.value)
                returnDateRef.current.min = chosenRentDate.toISOString().split('T')[0];
                console.log('🆁🅴🅽🆃 set returnDateRef.current.min', chosenRentDate.toISOString().split('T')[0])

                returnDateRef.current.max = maxReturnDate.toISOString().split('T')[0];
                console.log('🆁🅴🅽🆃 set returnDateRef.current.max', maxReturnDate.toISOString().split('T')[0])

            } else if (rentDateRef.current.value) {
                console.log('#3333')

                // Calculate the maximum return date (1 month from the rent date)
                const chosenRentDate = new Date(rentDateRef.current.value);
                console.log('🆁🅴🅽🆃 chosenRentDate', chosenRentDate.toISOString().split('T')[0])
                const maxReturnDate = new Date(chosenRentDate);
                maxReturnDate.setMonth(chosenRentDate.getMonth() + 1)
                console.log('🆁🅴🅽🆃 maxReturnDate', maxReturnDate.toISOString().split('T')[0])

                rentDateRef.current.min = TODAY;
                console.log('🆁🅴🅽🆃 set rentDateRef.current.min', TODAY)
                rentDateRef.current.max = "";
                console.log('🆁🅴🅽🆃 set rentDateRef.current.max', "")
                returnDateRef.current.min = chosenRentDate.toISOString().split('T')[0];
                console.log('🆁🅴🅽🆃 set returnDateRef.current.min', chosenRentDate.toISOString().split('T')[0])

                returnDateRef.current.max = maxReturnDate.toISOString().split('T')[0];
                console.log('🆁🅴🅽🆃 set returnDateRef.current.max', maxReturnDate.toISOString().split('T')[0])


            } else if (returnDateRef.current.value) {
                console.log('#4444')

                // Calculate the maximum return date (1 month from the rent date)
                const maxReturnDate = new Date(returnDateRef.current.value);
                console.log('🆁🅴🆃🆄🆁🅽 maxReturnDate', maxReturnDate)
                const minRentDate = new Date(maxReturnDate);
                minRentDate.setMonth(maxReturnDate.getMonth() - 1)
                console.log('🆁🅴🆃🆄🆁🅽 minRentDate', minRentDate)

                if (new Date() > minRentDate) {
                    rentDateRef.current.min = TODAY;
                    console.log(' 🆁🅴🆃🆄🆁🅽 rentDate min if', TODAY)

                } else {
                    rentDateRef.current.min = minRentDate.toISOString().split('T')[0];
                    console.log(' 🆁🅴🆃🆄🆁🅽 rentDate min else', minRentDate.toISOString().split('T')[0])

                }
                rentDateRef.current.max = maxReturnDate.toISOString().split('T')[0];
                console.log(' 🆁🅴🆃🆄🆁🅽 rentDateRef max', maxReturnDate.toISOString().split('T')[0])

                // returnDateRef.current.min = rentDateRef.current.min
                // returnDateRef.current.max = maxReturnDate.toISOString().split('T')[0];
                returnDateRef.current.min = TODAY
                returnDateRef.current.max = ""
                console.log(' 🆁🅴🆃🆄🆁🅽 returnDateRef min', TODAY)
                console.log(' 🆁🅴🆃🆄🆁🅽 returnDateRef max', "")
            }
        }
    };

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()

        const customer: Customer = queryClient.getQueryData(['customer'])!
        const vid = rentVehicleQuery.data?.id

        const pickUpLocationId = Number(pickUpLocationRef.current?.value);
        const dropOffLocationId = Number(dropOffLocationRef.current?.value);

        await mutation.mutateAsync({ customerId: customer.id, vehicleId: vid!, pickUpLocationId, dropOffLocationId });
        navigate('/reservations')
    }
    return (
        <>
            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <h1 className="text-2xl font-semibold mb-4">Fill out rent form</h1>

                    <label htmlFor="rentDateInput">Rent date:</label>
                    <input type="date" id="rentDateInput" min={TODAY} ref={rentDateRef} onChange={setMinAndMaxDates} required={true} />

                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Select pick-up location</label>
                        <select className="select select-bordered w-full" ref={pickUpLocationRef} required={true} aria-required={true}>
                            {locationsQuery.data.map((l, idx) => {
                                return (
                                    <option key={l.id} value={l.id} defaultChecked={idx === 0 ? true : false}>
                                        {l.name} / {l.address} / {l.city}
                                    </option>)
                            })}
                        </select>
                    </div>


                    <label htmlFor="returnDateInput">Return date:</label>
                    <input type="date" id="returnDateInput" min={TODAY} ref={returnDateRef} onChange={setMinAndMaxDates} required={true} />

                    <div className="mb-4 form-control w-full">
                        <label className="block text-sm font-medium mb-1">Select drop-off location</label>
                        <select className="select select-bordered w-full" ref={dropOffLocationRef} required={true} aria-required={true}>
                            {locationsQuery.data.map((l, idx) => {
                                return (
                                    <option key={l.id} value={l.id} defaultChecked={idx === 0 ? true : false}>
                                        {l.name} / {l.address} / {l.city}
                                    </option>)
                            })}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">Submit</button>
                </form>
            </div>
        </>
    )
}

export default RentPage