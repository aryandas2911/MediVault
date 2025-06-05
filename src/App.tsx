import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddRecord from './pages/AddRecord'
import EditRecord from './pages/EditRecord'
import Records from './pages/Records'
import Share from './pages/Share'
import SharedRecords from './pages/SharedRecords'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import NearbyHealthcare from './pages/NearbyHealthcare'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import LoadingSpinner from './components/LoadingSpinner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return session ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return !session ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '0.75rem',
                },
              }}
            />
            <Navbar />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <Landing />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/add-record"
                    element={
                      <PrivateRoute>
                        <AddRecord />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-record/:id"
                    element={
                      <PrivateRoute>
                        <EditRecord />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/records"
                    element={
                      <PrivateRoute>
                        <Records />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/share"
                    element={
                      <PrivateRoute>
                        <Share />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/shared/:id" element={<SharedRecords />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/nearby-healthcare"
                    element={
                      <PrivateRoute>
                        <NearbyHealthcare />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}