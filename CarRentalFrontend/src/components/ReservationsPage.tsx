import ReservationRow from './ReservationRow.js';
import Breadcrumbs from './Breadcrumbs.js';
import { useLocation } from 'react-router-dom';
import { Customer } from '../types.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import reservationService from '../services/reservation'

const ReservationsPage = () => {
    const queryClient = useQueryClient();
    const { pathname } = useLocation();

    const customer: Customer = queryClient.getQueryData(['customer'])!

    const reservationsQuery = useQuery(['reservations'], ()=>reservationService.getCustomerReservations(customer.id))


    return (
        <>
            <Breadcrumbs route={pathname} />
            <h1 className=' text-center mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white'>Your reservations</h1>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Rented</th>
                            <th>Pick-up Location</th>
                            <th>Returned</th>
                            <th>Drop-off Location</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {reservationsQuery.isLoading
                            ? (<p>Loading...</p>)
                            : (reservationsQuery.data?.map((r, idx) => <ReservationRow key={r.id} index={idx} reservation={r} />))

                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ReservationsPage