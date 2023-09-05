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
                            <th>License plate</th>
                            <th>Brand</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Rent Date</th>
                            <th>Pick-up Location</th>
                            <th>Return Date</th>
                            <th>Drop-off Location</th>
                            <th>Feedback</th>
                            <th>Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reservationsQuery.isLoading
                            ? (<tr><td>Loading...</td></tr>)
                            : (reservationsQuery.data?.map((r) => <ReservationRow key={r.id} reservation={r} />))

                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ReservationsPage