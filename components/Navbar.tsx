
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Youtube } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings['navbar'];
}

const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Apparel', path: '/apparel' },
    { name: 'Fibre Arts', path: '/fibre' },
    { name: 'Visual Arts', path: '/visual' },
    { name: 'Journal', path: '/journal' },
    { name: 'Admin', path: '/admin' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#F9F7F2]/90 backdrop-blur-sm border-b border-[#E5E0D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl serif font-semibold tracking-tight hover:opacity-70 transition-opacity">
            {settings.logo} <span className="text-xs tracking-widest block uppercase font-light -mt-1 italic">{settings.subtitle}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-10 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-widest hover:text-[#A09885] transition-colors ${
                  isActive(link.path) ? 'text-[#2C2C2C] font-semibold' : 'text-[#706C61]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-6 border-l border-[#E5E0D5] pl-6 text-[#706C61]">
              <Instagram size={18} className="cursor-pointer hover:text-black transition-colors" />
              <Facebook size={18} className="cursor-pointer hover:text-black transition-colors" />
              <Youtube size={18} className="cursor-pointer hover:text-black transition-colors" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#2C2C2C] p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F9F7F2] border-b border-[#E5E0D5] animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-lg serif tracking-wide ${
                  isActive(link.path) ? 'text-black font-semibold' : 'text-[#706C61]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
