
import React from 'react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings['hero'];
}

const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="relative h-[85vh] overflow-hidden bg-[#E5E0D5]">
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Image Section */}
        <div className="w-full md:w-1/3 h-full relative overflow-hidden group">
          <img 
            src={settings.imageLeft} 
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700" 
            alt="Crafting"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        {/* Center Text Section */}
        <div className="w-full md:w-1/3 h-full flex flex-col justify-center items-center px-12 text-center bg-[#F9F7F2] z-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#706C61] mb-6">{settings.tag}</span>
          <h1 className="text-5xl md:text-7xl serif leading-tight text-[#2C2C2C] mb-8">
            {settings.title}
          </h1>
          <p className="text-base text-[#706C61] font-light max-w-xs leading-relaxed mb-10">
            {settings.description}
          </p>
          <div className="w-12 h-[1px] bg-[#2C2C2C]"></div>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/3 h-full relative overflow-hidden group">
          <img 
            src={settings.imageRight} 
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700" 
            alt="Linen Dress"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
