import React from 'react'
import { SLTLogo } from './TS/Images';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            
            {/* Logo */}
            <div className="text-2xl font-bold text-green-600">
                <img src={SLTLogo}>
            </div>

            {/* Navigation Links */}
            <nav className="space-x-6">
                <a
                    href="/login"
                    className="text-gray-700 hover:text-green-600 transition"
                >
                    Login
                </a>
                <a
                    href="/register"
                    className="text-gray-700 hover:text-green-600 transition"
                >
                    Register
                </a>
                <a
                    href="/contact"
                    className="text-gray-700 hover:text-green-600 transition"
                >
                    Contact
                </a>
            </nav>

        </div>
    </header>
  )
}

export default Header;