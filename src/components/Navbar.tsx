import { LogOut, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { signOut } = useAuth()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            to="/dashboard" 
            className="flex items-center text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
          >
            MediVault
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="flex items-center text-accent hover:text-primary transition-colors"
              title="Profile"
            >
              <UserCircle className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Profile</span>
            </Link>
            <button
              onClick={signOut}
              className="flex items-center text-accent hover:text-primary transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}