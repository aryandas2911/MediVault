import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Records from './pages/Records';
import AddRecord from './pages/AddRecord';
import EditRecord from './pages/EditRecord';
import Share from './pages/Share';
import SharedRecords from './pages/SharedRecords';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import NearbyHealthcare from './pages/NearbyHealthcare';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return session ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !session ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={
                  <PublicRoute>
                    <Landing />
                  </PublicRoute>
                } />
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/records" element={
                  <PrivateRoute>
                    <Records />
                  </PrivateRoute>
                } />
                <Route path="/add-record" element={
                  <PrivateRoute>
                    <AddRecord />
                  </PrivateRoute>
                } />
                <Route path="/edit-record/:id" element={
                  <PrivateRoute>
                    <EditRecord />
                  </PrivateRoute>
                } />
                <Route path="/share" element={
                  <PrivateRoute>
                    <Share />
                  </PrivateRoute>
                } />
                <Route path="/shared/:id" element={<SharedRecords />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/nearby-healthcare" element={
                  <PrivateRoute>
                    <NearbyHealthcare />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;