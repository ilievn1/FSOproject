import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import VehiclesPage from './components/VehiclesPage.tsx';
import MainPage from './components/MainPage.tsx';
import ReservationsPage from './components/ReservationsPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import RegistrationPage from './components/RegistrationPage.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import ProfilePage from './components/ProfilePage.tsx';
import RentPage from './components/RentPage.tsx';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Customer } from './types.ts';

const App = () => {
  const getCustomer = async (): Promise<Customer> => {
    const resp = await axios.get('http://localhost:3001/api/customers/current', { withCredentials: true })
    return resp.data
  }
  const searchParams = new URLSearchParams(window.location.search);
  const isAuthenticated = searchParams.get("authenticated");
  const result = useQuery({
    staleTime: Infinity,
    enabled: !!isAuthenticated,
    queryKey: ['customer'],
    queryFn: getCustomer
  })
  console.log(JSON.parse(JSON.stringify(result)))

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/adminpanel" element={<AdminDashboard />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/rent" element={<RentPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
