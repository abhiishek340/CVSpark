'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80; // Height of your fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    if (onClick) onClick();
  };

  return (
    <a 
      href={href} 
      className="text-gray-600 hover:text-gray-900 transition-colors duration-200" 
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className={`text-2xl font-bold ${
            isScrolled ? 'text-gray-900' : 'text-gray-900'
          }`}>
            FutureFit
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <Link href="/login">
              <Button variant="ghost" className="bg-[#2557a7] hover:bg-[#1e4687] text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#2557a7] hover:bg-[#1e4687] text-white">
                Sign Up
              </Button>
            </Link>
          </nav>
          <button
            className="md:hidden text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 space-y-4">
            <NavLink href="#features" onClick={() => setIsMobileMenuOpen(false)}>
              Features
            </NavLink>
            <NavLink href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
              How It Works
            </NavLink>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full text-gray-600">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button className="w-full bg-[#2557a7] hover:bg-[#1e4687] text-white">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

