import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddRecord from './pages/AddRecord'
import EditRecord from './pages/EditRecord'
import Records from './pages/Records'
import Share from './pages/Share'
import SharedRecords from './pages/SharedRecords'
import { AuthProvider, useAuth } from './context/AuthContext'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  return session ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  return !session ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
          <Route
            path="/shared/:id"
            element={<SharedRecords />}
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <div>About Page (Coming Soon)</div>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login\" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}