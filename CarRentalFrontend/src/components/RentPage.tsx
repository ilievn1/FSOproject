import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from "./Breadcrumbs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useMemo, useRef, useState } from 'react';
import vehicleService from '../services/vehicle'
import reservationService from '../services/reservation'
import locationService from '../services/location'
import customerService from '../services/customer'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { DateRange } from '../types';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

const formatDate = (date: Date | null): string =>{
    if (date === null) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const formatDateRangeArrayToISO = (dateRange: DateRange): [string, string] | null =>{
    if (Array.isArray(dateRange) && dateRange.length === 2) {
        return [formatDate(dateRange[0]), formatDate(dateRange[1])];
    } else {
        return null;
    }
}



const RentPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const queryClient = useQueryClient();
    const [dateRange, setDateRange] = useState<DateRange>([new Date(), new Date()]);

    const [brand, model, year] = useMemo(() => {
        const brandValue = searchParams.get('brand')
        const modelValue = searchParams.get('model')
        const yearValue = searchParams.get('year')

        return [brandValue, modelValue, yearValue];
    }, [searchParams]);

    // In reality params can be null. Parameter integrity checking delegated to server
    const vehicleNonAvailableDatesQuery = useQuery({ queryKey: ['vehicleNonAvailableDates'], queryFn: () => vehicleService.vehicleNonAvailableDates(brand!, model!, year!), refetchOnMount: "always" })
    const locationsQuery = useQuery(['locations'], locationService.getAll)

    const pickUpLocationRef = useRef<HTMLSelectElement>(null);
    const dropOffLocationRef = useRef<HTMLSelectElement>(null);

    const postReservationMutation = useMutation({
        mutationFn: reservationService.postCustomerReservation,
        onSuccess: () => {
            queryClient.invalidateQueries(['reservations']);
        },
        onError: (error) => {
            window.alert(`Error creating reservation: \n${error}`);
            console.error("Error creating reservation:", error);
        },
    });

    if (vehicleNonAvailableDatesQuery.isLoading || locationsQuery.isLoading) {
        return (<p>Fetching data...</p>)
    }

    if (locationsQuery.isError) {
        return (<p>Error fetching locations...</p>)
    }
    console.log('dateRange?.toLocaleString()', dateRange?.toLocaleString());
    console.log('vehicleNonAvailableDatesQuery.data', vehicleNonAvailableDatesQuery.data);

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()

        const customer = await queryClient.ensureQueryData(['customer'], customerService.getCustomer)

        const pickUpLocationId = Number(pickUpLocationRef.current?.value);
        const dropOffLocationId = Number(dropOffLocationRef.current?.value);

        if (!customer.id
            || !pickUpLocationId
            || !dropOffLocationId
            || !dateRange
            || !formatDateRangeArrayToISO(dateRange)) {
            window.alert('Missing fields');
            return;
        }
        await postReservationMutation.mutateAsync({
            brand: brand!,
            model: model!,
            year: year!,
            customerId: customer.id,
            rentDate: formatDateRangeArrayToISO(dateRange)![0],
            returnDate: formatDateRangeArrayToISO(dateRange)![1],
            pickUpLocationId,
            dropOffLocationId
        });
        navigate('/reservations')
    }
    return (
        <>
            <Breadcrumbs route={pathname} />
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="p-6 shadow-xl rounded-lg basis-2/3">
                    <h1 className="text-2xl font-semibold mb-4">Fill out rent form</h1>
                    <DateRangePicker onChange={setDateRange} value={dateRange} minDate={new Date()} tileDisabled={({ date: calendarDate }) => vehicleNonAvailableDatesQuery.data.includes(calendarDate.toISOString().split('T').at(0))} required={true} />

                    {/* <label htmlFor="rentDateInput">Rent date:</label>
                    <input type="date" id="rentDateInput" min={TODAY} ref={rentDateRef} onChange={setMinAndMaxDates} required={true} /> */}

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


                    {/* <label htmlFor="returnDateInput">Return date:</label>
                    <input type="date" id="returnDateInput" min={TODAY} ref={returnDateRef} onChange={setMinAndMaxDates} required={true} /> */}

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