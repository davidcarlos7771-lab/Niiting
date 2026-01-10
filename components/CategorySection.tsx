
import React from 'react';
import { Link } from 'react-router-dom';
import { PortfolioItem, Category } from '../types';

interface CategorySectionProps {
  category: Category;
  items: PortfolioItem[];
  link: string;
  onItemClick: (item: PortfolioItem) => void;
  customTitle?: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, items, link, onItemClick, customTitle }) => {
  // Always grab top 4 for the grid logic
  const displayItems = items.filter(item => item.category === category).slice(0, 4);

  return (
    <section className="py-24 px-4 md:px-12 border-b border-[#E5E0D5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{category}</p>
          <h2 className="text-4xl serif italic break-all">{customTitle || 'Featured Collections'}</h2>
        </div>

        {/* Responsive grid display logic: 1 col (mobile), 3 cols (tablet), 4 cols (PC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayItems.map((item, idx) => (
            <div 
              key={item.id} 
              className={`flex flex-col cursor-pointer group overflow-hidden
                ${idx >= 1 ? 'hidden md:flex' : ''} 
                ${idx >= 3 ? 'md:hidden lg:flex' : ''}`}
              onClick={() => onItemClick(item)}
            >
              <div className="aspect-[9/16] overflow-hidden mb-6 bg-[#E5E0D5] relative shadow-sm">
                <img 
                  src={item.imageUrls[0]} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                {item.imageUrls.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-white/90 px-2 py-1 text-[8px] uppercase tracking-widest">
                    +{item.imageUrls.length - 1} Images
                  </div>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#706C61] mb-2 break-all line-clamp-2 min-h-[1.5em]">{item.subtitle}</p>
              <h3 className="text-xl serif mb-4 group-hover:italic transition-all break-all line-clamp-2 min-h-[2.4em]">{item.title}</h3>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link 
            to={link} 
            className="inline-block px-10 py-3 border border-[#2C2C2C] text-xs uppercase tracking-widest hover:bg-[#2C2C2C] hover:text-white transition-all"
          >
            View All {category}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
