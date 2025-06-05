import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F0F4FF] to-white">
      <img 
        src="/Logo.png" 
        alt="MediVault Logo" 
        className="w-16 h-16 mb-8 animate-pulse"
      />
      <motion.div
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}