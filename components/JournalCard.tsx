
import React from 'react';
import { BlogPost } from '../types';

interface JournalCardProps {
  post: BlogPost;
  featured?: boolean;
  onClick?: (post: BlogPost) => void;
  className?: string; // Allow passing visibility classes
}

const JournalCard: React.FC<JournalCardProps> = ({ post, featured = false, onClick, className = "" }) => {
  if (featured) {
    return (
      <div className={`group cursor-pointer mb-20 ${className}`} onClick={() => onClick?.(post)}>
        <div className="relative h-[80vh] overflow-hidden mb-8 aspect-[9/16] mx-auto md:w-[60%] flex items-end justify-center">
          <img 
            src={post.imageUrls[0]} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
          <div className="relative z-10 w-full p-8 md:p-12 text-white text-center">
            <p className="text-xs uppercase tracking-widest mb-4 opacity-80">Featured Entry</p>
            <h3 className="text-3xl md:text-5xl serif leading-tight break-all mb-6 max-w-[90%] mx-auto line-clamp-2">{post.title}</h3>
            <div className="inline-block border-b border-white pb-1">
              <span className="text-[10px] uppercase tracking-widest">Read Full Narrative</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group cursor-pointer flex flex-col overflow-hidden ${className}`} onClick={() => onClick?.(post)}>
      <div className="aspect-[9/16] overflow-hidden mb-6 bg-[#E5E0D5] shadow-sm relative">
        <img 
          src={post.imageUrls[0]} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {post.imageUrls.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-white/90 px-2 py-1 text-[8px] uppercase tracking-widest">
            +{post.imageUrls.length - 1} Images
          </div>
        )}
      </div>
      <p className="text-[10px] uppercase tracking-widest text-[#706C61] mb-2">{post.date}</p>
      <h3 className="text-xl serif mb-3 group-hover:italic transition-all break-all line-clamp-2 min-h-[2.4em]">{post.title}</h3>
      <p className="text-sm text-[#706C61] font-light line-clamp-3 leading-relaxed mb-4 break-all">{post.content}</p>
      <button className="text-[10px] uppercase tracking-widest border-b border-black pb-1 self-start">Read More</button>
    </div>
  );
};

export default JournalCard;
