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
import AdminDashboard from './components/AdminDashboard.tsx';
import RentPage from './components/RentPage.tsx';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Customer } from './types.ts';
import { useEffect } from 'react';

const App = () => {

  const getCustomer = async (): Promise<Customer> => {
    const resp = await axios.get('http://localhost:3001/api/customers/current', { withCredentials: true })
    return resp.data
  }

  const customerQuery = useQuery(
    ['customer'],
    getCustomer,
    {
      initialData: localStorage.getItem('customerDetails') ? JSON.parse(localStorage.getItem('customerDetails')!) : undefined
}
  )

  useEffect(() => {
    if (customerQuery.data) {
      localStorage.setItem('customerDetails', JSON.stringify(customerQuery.data));
    }
  }, [customerQuery.data]);
  // TODO: Extract comm service function to their own file
  // TODO: Change color theme to white-ish
  // TODO: Clear unused pages, login, register, admin (including navbar items associated with them)
  // TODO: Clear console.logs
  // TODO: Fix logout functionality (right link, redirect clear locStor)
  // TODO: Inquiries - backend comm, input form val

  // HOSTING
  // TODO: localhost addresses to env var
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/adminpanel" element={<AdminDashboard />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path='/login' Component={() => { window.location.href = 'http://localhost:3001/api/auth/google'; return null; }} />
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
