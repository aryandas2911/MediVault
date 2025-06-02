import { LogOut } from 'lucide-react'
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
          <button
            onClick={signOut}
            className="flex items-center text-accent hover:text-primary transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}