import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Customer, DateRange } from '../types';
import { SyntheticEvent, useMemo, useRef, useState } from 'react';
import vehicleService from '../services/vehicle'
import reservationService from '../services/reservation'
import locationService from '../services/location'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
const TODAY = new Date()

const RentPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const [dateRange, setDateRange] = useState<DateRange>([new Date(), new Date()]);
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

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()
        console.log(dateRange?.toLocaleString().split(',')[0].split(' ')[0]);
        console.log(dateRange?.toLocaleString().split(',')[1].split(' ')[0]);

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

                    <div>
                        <label htmlFor='dateRange'>Select rent and return dates: </label>
                        <DateRangePicker id='dateRange' onChange={setDateRange} value={dateRange} minDate={TODAY} required={true} defaultActiveStartDate={TODAY} autoFocus={true} />
                    </div>

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