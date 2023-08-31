import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';
import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom'
import VehiclesPage from './components/VehiclesPage.tsx';
import MainPage from './components/MainPage.tsx';
import ReservationsPage from './components/ReservationsPage.tsx';
import RegistrationPage from './components/RegistrationPage.tsx';
import RentPage from './components/RentPage.tsx';
import { useQuery } from "@tanstack/react-query";
import customerService from './services/customer.ts'

import { useEffect } from 'react';

const App = () => {

  const customerQuery = useQuery(['customer'], customerService.getCustomer,
    {
      initialData: localStorage.getItem('customerDetails') ? JSON.parse(localStorage.getItem('customerDetails')!) : undefined
    }
  )

  useEffect(() => {
    if (customerQuery.data) {
      localStorage.setItem('customerDetails', JSON.stringify(customerQuery.data));
    }
  }, [customerQuery.data]);

// TODO: Test extracted services
  
// TODO: Dates for pick-up drop-off calendar selector -> relay info to services

  // TODO: Pick-up/Drop-off locations -> types, fields in tables, append details to comm services, event handlers


  // Clean-up
  // TODO: Clear unused pages, login, register, admin (including navbar items associated with them)
  // TODO: Clear console.logs
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path='/login' Component={() => { window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`; return null; }} />
          <Route path="/reservations" element={customerQuery.data ? <ReservationsPage /> : <Navigate replace to="/login" />} />
          <Route path="/rent" element={customerQuery.data ? <RentPage /> : <Navigate replace to="/login" />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
