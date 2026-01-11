
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
    { name: settings.links.home, path: '/' },
    { name: settings.links.apparel, path: '/apparel' },
    { name: settings.links.fibre, path: '/fibre' },
    { name: settings.links.visual, path: '/visual' },
    { name: settings.links.journal, path: '/journal' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#F9F7F2]/90 backdrop-blur-sm border-b border-[#E5E0D5]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex justify-between h-28 items-center">
          {/* Logo Group - Left Aligned */}
          <Link to="/" className="flex flex-col group transition-opacity hover:opacity-80">
            <span className="text-3xl serif font-semibold tracking-tighter text-[#2C2C2C]">
              {settings.logo}
            </span>
            <span className="text-2xl script text-[#A09885] -mt-2">
              {settings.subtitle}
            </span>
          </Link>

          {/* Nav & Socials Group - Hidden on Mobile and Tablet (below 1024px) */}
          <div className="hidden lg:flex items-center space-x-12">
            <div className="flex space-x-10 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[11px] uppercase tracking-[0.2em] hover:text-[#A09885] transition-colors ${
                    isActive(link.path) ? 'text-[#2C2C2C] font-bold border-b-2 border-black pb-1' : 'text-[#706C61]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-6 border-l border-[#E5E0D5] pl-10 text-[#706C61]">
              <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                <Youtube size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Mobile/Tablet Menu Button - Visible below 1024px */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#2C2C2C] p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#F9F7F2] border-b border-[#E5E0D5] animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-2 pb-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-xl serif tracking-wide ${
                  isActive(link.path) ? 'text-black font-semibold underline underline-offset-8' : 'text-[#706C61]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex space-x-8 pt-6 border-t border-[#E5E0D5]">
              <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[#706C61]">
                <Instagram size={24} />
              </a>
              <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[#706C61]">
                <Facebook size={24} />
              </a>
              <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-[#706C61]">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
