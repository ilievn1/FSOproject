import ContactForm from './components/ContactForm.tsx';
import DividedTopModels from './components/DividedTopModels.tsx';
import Footer from './components/Footer.tsx';
import Hero from './components/Hero.tsx';
import Navbar from './components/Navbar.tsx';

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <DividedTopModels />
      <ContactForm />
      <Footer />
    </>
  )
}

export default App
