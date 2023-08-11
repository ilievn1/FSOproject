import Footer from './components/Footer.tsx';
import Navbar from './components/Navbar.tsx';
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import VehiclesPage from './components/VehiclesPage.tsx';
import MainPage from './components/MainPage.tsx';
import ReservationPage from './components/ReservationPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import RegistrationPage from './components/RegistrationPage.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import ProfilePage from './components/ProfilePage.tsx';

const App = () => {
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
          <Route path="/reservations" element={<ReservationPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
