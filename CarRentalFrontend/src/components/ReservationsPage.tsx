import ReservationRow from './ReservationRow.js';
import Breadcrumbs from './Breadcrumbs.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Customer, Reservation } from '../types.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import shortid from 'shortid';
const ReservationsPage = () => {
    const queryClient = useQueryClient();
    const { pathname } = useLocation();

    const getReservations = async (customerId: number): Promise<Reservation[]> => {
        const resp = await axios.get(`http://localhost:3001/api/customers/${customerId}/reservations`, { withCredentials: true })
        return resp.data
    }
    const customer: Customer = queryClient.getQueryData(['customer'])!
    
    const reservationsQuery = useQuery(['reservations'], () => getReservations(customer.id))


    return (
        <>
            <Breadcrumbs route={pathname} />
            <h1 className=' text-center mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white'>Your reservations</h1>
            {reservationsQuery.isLoading
                ? (<p>Loading...</p>)
                : (reservationsQuery.data?.map((r) => <ReservationRow key={shortid.generate()} reservation={r} />))
            }
        </>
    )
}

export default ReservationsPage