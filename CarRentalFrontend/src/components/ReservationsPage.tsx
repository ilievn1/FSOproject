import ReservationCollapseble from './ReservationCollapseble';
import Breadcrumbs from './Breadcrumbs.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Customer, Reservation } from '../types.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';


// TODO: as many collapse elements as active reservations User.reservations.map(...)
// TODO: remove feedback btn when feedback for corresponding reservation ID has been given 
// TODO: remove individual reservation when feedback is given or delete button is clicked
const ReservationsPage = () => {
    const queryClient = useQueryClient();
    const { pathname } = useLocation();

    const customer: Customer | undefined = queryClient.getQueryData(['customer'])

    console.log(customer)

    const getReservations = useCallback(async (): Promise<Reservation[]> => {
        const resp = await axios.get(`http://localhost:3001/api/customers/${customer?.id}/reservations`, { withCredentials: true })
        return resp.data
    }, [customer]);

    // const getReservations = async (): Promise<Reservation> => {
    //     const resp = await axios.get(`http://localhost:3001/api/customers/${customer?.id}/reservations`, { withCredentials: true })
    //     return resp.data
    // }
    
    const reservations = useQuery({
        queryKey: ['reservations'],
        queryFn: getReservations
    })

    return (
        <>
            <Breadcrumbs route={pathname} />
            {reservations.isLoading
            ? (<p>Loading...</p>)
                : (reservations.data?.map((r) => <ReservationCollapseble reservation={r} />))}
        </>
    )
}

export default ReservationsPage