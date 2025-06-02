import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
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
                <div>Add Record Page (Coming Soon)</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/records"
            element={
              <PrivateRoute>
                <div>My Records Page (Coming Soon)</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/share"
            element={
              <PrivateRoute>
                <div>Share Records Page (Coming Soon)</div>
              </PrivateRoute>
            }
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