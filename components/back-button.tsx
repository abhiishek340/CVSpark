import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export function BackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        href="/" 
        className="inline-flex items-center px-4 py-2 space-x-2 text-gray-600 transition-colors 
          hover:text-gray-900 group bg-white/50 backdrop-blur-sm rounded-full shadow-sm 
          hover:shadow-md duration-200"
      >
        <ArrowLeft 
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" 
        />
        <span>Back to Home</span>
      </Link>
    </motion.div>
  )
} 