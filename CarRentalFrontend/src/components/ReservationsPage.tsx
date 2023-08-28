import ReservationRow from './ReservationRow.js';
import Breadcrumbs from './Breadcrumbs.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Customer, Reservation } from '../types.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import shortid from 'shortid';


// TODO: remove feedback btn when feedback for corresponding reservation ID has been given 
// TODO: remove individual reservation when feedback is given or delete button is clicked
const ReservationsPage = () => {
    const queryClient = useQueryClient();
    const { pathname } = useLocation();

    const customer: Customer | undefined = queryClient.getQueryData(['customer'])

    const getReservations = useCallback(async (): Promise<Reservation[]> => {
        const resp = await axios.get(`http://localhost:3001/api/customers/${customer?.id}/reservations`, { withCredentials: true })
        return resp.data
    }, [customer]);

    // const getReservations = async (): Promise<Reservation> => {
    //     const resp = await axios.get(`http://localhost:3001/api/customers/${customer?.id}/reservations`, { withCredentials: true })
    //     return resp.data
    // }

    const reservations = useQuery({
        enabled: !!customer,
        queryKey: ['reservations'],
        queryFn: getReservations
    })

    return (
        <>
            <Breadcrumbs route={pathname} />
            <h1 className=' text-center mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white'>Your reservations</h1>
            {reservations.isLoading
                ? (<p>Loading...</p>)
                : (reservations.data?.map((r) => <ReservationRow key={shortid.generate()} reservation={r} />))
            }
        </>
    )
}

export default ReservationsPage