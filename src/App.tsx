import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/records" element={<Records />} />
                <Route path="/records/add" element={<AddRecord />} />
                <Route path="/records/edit/:id" element={<EditRecord />} />
                <Route path="/share" element={<Share />} />
                <Route path="/shared" element={<SharedRecords />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/nearby-healthcare" element={<NearbyHealthcare />} />
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