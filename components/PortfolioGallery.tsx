
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioGalleryProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ item, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!item) return null;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % item.imageUrls.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + item.imageUrls.length) % item.imageUrls.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#F9F7F2]/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      {/* Hide close button on mobile (hidden), show on medium screens and up (md:block) */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-2 text-[#2C2C2C] hover:scale-110 transition-transform hidden md:block z-[110]"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <div className="w-full max-w-7xl px-4 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12 py-12">
        <div className="w-full md:w-auto flex justify-center relative group">
          {/* Aspect ratio changed to 9:16 (vertical) */}
          <div className="aspect-[9/16] h-[70vh] md:h-[80vh] overflow-hidden bg-[#E5E0D5] shadow-2xl relative">
            <img 
              src={item.imageUrls[currentIndex]} 
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" 
              alt={`${item.title} - ${currentIndex + 1}`}
            />
          </div>

          {item.imageUrls.length > 1 && (
            <>
              <button 
                onClick={prev}
                className="absolute left-[-20px] md:left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={next}
                className="absolute right-[-20px] md:right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {item.imageUrls.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#2C2C2C]' : 'w-2 bg-[#2C2C2C]/20'}`} 
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-1/3 text-left bg-white/50 p-6 md:bg-transparent md:p-0 rounded-lg">
          <p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{item.category}</p>
          <h2 className="text-3xl md:text-5xl serif mb-4 leading-tight">{item.title}</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#A09885] mb-6">{item.subtitle}</p>
          <div className="w-12 h-[1px] bg-[#2C2C2C] mb-6"></div>
          <p className="text-[#2C2C2C] font-light leading-relaxed mb-8 max-h-[30vh] overflow-y-auto">{item.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-[#A09885] uppercase tracking-tighter">
              Slide {currentIndex + 1} of {item.imageUrls.length}
            </p>
            <button className="md:hidden text-xs uppercase tracking-widest border-b border-black pb-1">Tap to close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioGallery;
