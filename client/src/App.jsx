import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import theme from './theme'
import LandingPage from './page/LandingPage'
import Login from './page/login'
import Signup from './page/Signup'
import Home from './page/Home'
import Profile from './page/Profile'
import MeetingRoom from './page/MeetingRoom'
import { SocketProvider } from './context/socketContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AnimatedRoutes() {
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/room/:id" element={<MeetingRoom />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <CssBaseline />
          <Router>
            <AnimatedRoutes />
          </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </SocketProvider>
    </ThemeProvider>
  )
}

export default App