
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import JournalCard from './components/JournalCard';
import AdminLogin from './components/AdminLogin';
import PortfolioGallery from './components/PortfolioGallery';
import { Category, PortfolioItem, BlogPost } from './types';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS } from './constants';
import { Plus, Trash2, Camera, LogOut, Image as ImageIcon, X, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';

// Shared Components
const Footer: React.FC = () => (
  <footer className="bg-[#2C2C2C] text-[#F9F7F2] py-20 px-4 md:px-12 mt-24">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start">
      <div className="mb-12 md:mb-0">
        <h3 className="text-2xl serif mb-6">Join the inner circle for pattern releases and design musings.</h3>
        <div className="flex border-b border-[#706C61] pb-2 max-w-sm">
          <input type="email" placeholder="Email" className="bg-transparent border-none outline-none text-sm w-full" />
          <button className="text-xs uppercase tracking-widest">Subscribe</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-12 md:gap-24 text-xs uppercase tracking-[0.2em] text-[#A09885]">
        <ul className="space-y-4">
          <li><Link to="/">About</Link></li>
          <li><Link to="/apparel">Portfolio</Link></li>
          <li><Link to="/">Shop</Link></li>
        </ul>
        <ul className="space-y-4">
          <li><Link to="/journal">Journal</Link></li>
          <li><Link to="/">Contact</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

// Detail View Components
const BlogDetail: React.FC<{ post: BlogPost | null, onClose: () => void }> = ({ post, onClose }) => {
  const [currentImg, setCurrentImg] = useState(0);
  
  if (!post) return null;

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % post.imageUrls.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + post.imageUrls.length) % post.imageUrls.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#F9F7F2] backdrop-blur-3xl overflow-y-auto animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-32" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="fixed top-8 right-8 p-2 hover:scale-110 transition-transform hidden md:block z-[110]"
        >
          <X size={32} strokeWidth={1} />
        </button>

        <div className="text-center">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#706C61] mb-6">{post.date} — By {post.author}</p>
          <h1 className="text-3xl md:text-7xl serif leading-tight mb-12 break-all px-4">{post.title}</h1>
          
          <div className="relative aspect-[9/16] w-full max-w-sm mx-auto overflow-hidden bg-[#E5E0D5] mb-16 shadow-2xl group">
            <img src={post.imageUrls[currentImg]} className="w-full h-full object-cover transition-opacity duration-500" alt={post.title} />
            
            {post.imageUrls.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {post.imageUrls.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentImg ? 'bg-black' : 'bg-black/20'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="text-left text-base md:text-xl text-[#2C2C2C] font-light leading-relaxed space-y-8 whitespace-pre-wrap max-w-2xl mx-auto break-all overflow-hidden px-4">
            {post.content}
          </div>
          
          <div className="mt-20 pt-12 border-t border-[#E5E0D5]">
            <button 
              onClick={onClose} 
              className="text-[10px] md:text-xs uppercase tracking-widest border border-black px-12 py-4 hover:bg-black hover:text-white transition-all"
            >
              Return to Journal
            </button>
            <p className="mt-8 md:hidden text-[10px] uppercase tracking-widest text-[#A09885]">Tap background to close</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pages
const HomePage: React.FC<{ 
  portfolio: PortfolioItem[], 
  blogs: BlogPost[], 
  onItemClick: (item: PortfolioItem) => void,
  onBlogClick: (blog: BlogPost) => void
}> = ({ portfolio, blogs, onItemClick, onBlogClick }) => (
  <main className="animate-in fade-in duration-1000">
    <Hero />
    <CategorySection category={Category.APPAREL} items={portfolio} link="/apparel" onItemClick={onItemClick} />
    <CategorySection category={Category.FIBRE} items={portfolio} link="/fibre" onItemClick={onItemClick} />
    <CategorySection category={Category.VISUAL} items={portfolio} link="/visual" onItemClick={onItemClick} />
    
    <section className="py-24 px-4 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">Journal (The Narrative)</p>
          <h2 className="text-5xl serif tracking-tight break-all">LIVING PORTFOLIO-JOURNAL</h2>
        </div>
        
        {/* Featured Blog */}
        {blogs.length > 0 && <JournalCard post={blogs[0]} featured onClick={onBlogClick} />}
        
        {/* Universal responsive grid: 1 col (mobile), 3 cols (tablet), 4 cols (PC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {blogs.slice(1, 5).map((blog, idx) => (
            <JournalCard 
              key={blog.id} 
              post={blog} 
              onClick={onBlogClick} 
              className={`
                ${idx >= 1 ? 'hidden md:block' : ''} 
                ${idx >= 3 ? 'md:hidden lg:block' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  </main>
);

const CategoryPage: React.FC<{ 
  category: Category, 
  items: PortfolioItem[], 
  onItemClick: (item: PortfolioItem) => void 
}> = ({ category, items, onItemClick }) => {
  const filtered = items.filter(i => i.category === category);
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
      <div className="mb-20 text-center px-4">
        <h1 className="text-6xl serif mb-4 break-all">{category}</h1>
        <div className="w-16 h-[1px] bg-[#2C2C2C] mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="group cursor-pointer flex flex-col overflow-hidden" onClick={() => onItemClick(item)}>
            <div className="aspect-[9/16] overflow-hidden mb-6 bg-[#E5E0D5] relative shadow-sm">
              <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {item.imageUrls.length > 1 && (
                <div className="absolute top-4 left-4 bg-white/80 p-2 text-[8px] uppercase tracking-widest">
                  Gallery View
                </div>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#706C61] mb-2 break-all line-clamp-2 min-h-[1.5em]">{item.subtitle}</p>
            <h3 className="text-xl serif mb-2 group-hover:italic transition-all break-all line-clamp-2 min-h-[2.4em]">{item.title}</h3>
            <p className="text-xs text-[#706C61] font-light leading-relaxed line-clamp-3 break-all">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const JournalPage: React.FC<{ blogs: BlogPost[], onBlogClick: (blog: BlogPost) => void }> = ({ blogs, onBlogClick }) => (
  <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
    <div className="mb-20 text-center px-4">
      <h1 className="text-6xl serif mb-4 break-all">Journal</h1>
      <p className="text-sm uppercase tracking-widest text-[#706C61]">The Narrative of Slow Living</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {blogs.map(blog => (
        <JournalCard key={blog.id} post={blog} onClick={onBlogClick} />
      ))}
    </div>
  </div>
);

// Admin Component
const AdminDashboard: React.FC<{ 
  portfolio: PortfolioItem[], 
  blogs: BlogPost[], 
  onLogout: () => void,
  onAddItem: (item: PortfolioItem) => void,
  onAddBlog: (blog: BlogPost) => void,
  onDeleteItem: (id: string) => void,
  onDeleteBlog: (id: string) => void,
  onUpdateItem: (id: string, item: PortfolioItem) => void,
  onUpdateBlog: (id: string, blog: BlogPost) => void
}> = ({ portfolio, blogs, onLogout, onAddItem, onAddBlog, onDeleteItem, onDeleteBlog, onUpdateItem, onUpdateBlog }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'blog'>('portfolio');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.APPAREL);
  const [newImages, setNewImages] = useState<string[]>([]);
  
  // State for Date and Author
  const [newDate, setNewDate] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  // Auto-set defaults when active tab changes or initial load
  useEffect(() => {
    if (!editingId) {
      setNewDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      setNewAuthor('Elena');
    }
  }, [activeTab, editingId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeSelectedImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setNewTitle('');
    setNewSubtitle('');
    setNewDesc('');
    setNewImages([]);
    setEditingId(null);
    setNewDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setNewAuthor('Elena');
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setActiveTab('portfolio');
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewSubtitle(item.subtitle || '');
    setNewDesc(item.description);
    setNewCategory(item.category);
    setNewImages(item.imageUrls);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditBlog = (blog: BlogPost) => {
    setActiveTab('blog');
    setEditingId(blog.id);
    setNewTitle(blog.title);
    setNewDesc(blog.content);
    setNewImages(blog.imageUrls);
    setNewDate(blog.date);
    setNewAuthor(blog.author);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newTitle || newImages.length === 0) {
      alert("Please provide at least a title and one image.");
      return;
    }

    try {
      if (activeTab === 'portfolio') {
        const item: PortfolioItem = {
          id: editingId || Math.random().toString(36).substr(2, 9),
          title: newTitle,
          subtitle: newSubtitle,
          description: newDesc,
          category: newCategory,
          imageUrls: newImages,
          createdAt: Date.now()
        };
        if (editingId) onUpdateItem(editingId, item);
        else onAddItem(item);
        alert(editingId ? "Project updated!" : "Project published!");
      } else {
        const blog: BlogPost = {
          id: editingId || Math.random().toString(36).substr(2, 9),
          title: newTitle,
          date: newDate,
          content: newDesc,
          imageUrls: newImages, 
          author: newAuthor
        };
        if (editingId) onUpdateBlog(editingId, blog);
        else onAddBlog(blog);
        alert(editingId ? "Entry updated!" : "Entry published!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to publish. Local storage may be full.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen animate-in fade-in">
      <div className="flex justify-between items-center mb-12 pb-6 border-b border-[#E5E0D5]">
        <h1 className="text-4xl serif">Studio Management</h1>
        <button onClick={onLogout} className="flex items-center text-xs uppercase tracking-widest text-[#706C61] hover:text-black">
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 space-y-8 p-8 bg-white border border-[#E5E0D5] sticky top-24 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl uppercase tracking-widest">{editingId ? 'Edit' : 'Create New'} {activeTab === 'portfolio' ? 'Project' : 'Entry'}</h2>
            {editingId && (
              <button onClick={resetForm} className="text-[10px] uppercase border-b border-black">Cancel Edit</button>
            )}
          </div>
          
          <div className="flex bg-[#F9F7F2] p-1 mb-6">
            <button 
              type="button"
              onClick={() => { setActiveTab('portfolio'); resetForm(); }} 
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'portfolio' ? 'bg-white shadow-sm font-bold' : 'text-[#A09885]'}`}
            >
              Portfolio
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('blog'); resetForm(); }} 
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'blog' ? 'bg-white shadow-sm font-bold' : 'text-[#A09885]'}`}
            >
              Journal
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'portfolio' && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#706C61] mb-2">Category</label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value as Category)}
                  className="w-full p-3 border border-[#E5E0D5] outline-none text-sm"
                >
                  <option value={Category.APPAREL}>Apparel Design</option>
                  <option value={Category.FIBRE}>Fibre Arts</option>
                  <option value={Category.VISUAL}>Visual Arts</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#706C61] mb-2">Title</label>
              <input 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                className="w-full p-3 border border-[#E5E0D5] outline-none text-sm"
              />
            </div>

            {activeTab === 'portfolio' ? (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#706C61] mb-2">Subtitle</label>
                <input 
                  value={newSubtitle} 
                  onChange={(e) => setNewSubtitle(e.target.value)} 
                  className="w-full p-3 border border-[#E5E0D5] outline-none text-sm"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#706C61] mb-2">Date</label>
                  <input 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)} 
                    className="w-full p-3 border border-[#E5E0D5] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#706C61] mb-2">Author</label>
                  <input 
                    value={newAuthor} 
                    onChange={(e) => setNewAuthor(e.target.value)} 
                    className="w-full p-3 border border-[#E5E0D5] outline-none text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#706C61] mb-2">{activeTab === 'portfolio' ? 'Description' : 'Full Content'}</label>
              <textarea 
                rows={8} 
                value={newDesc} 
                onChange={(e) => setNewDesc(e.target.value)} 
                className="w-full p-3 border border-[#E5E0D5] outline-none text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#706C61] mb-2">Images (Vertical 9:16)</label>
              <div className="relative border-2 border-dashed border-[#E5E0D5] rounded-lg p-6 text-center hover:border-[#A09885] transition-colors cursor-pointer">
                <ImageIcon size={32} className="text-[#A09885] mb-2 mx-auto" />
                <p className="text-[10px] text-[#A09885] uppercase">Upload Images</p>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              {newImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {newImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-[9/16]">
                      <img src={img} className="w-full h-full object-cover rounded shadow-sm" />
                      <button type="button" onClick={() => removeSelectedImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 bg-[#2C2C2C] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors flex items-center justify-center"
            >
              {editingId ? <Edit3 size={14} className="mr-2" /> : <Plus size={14} className="mr-2" />} 
              {editingId ? 'Save Changes' : `Publish to ${activeTab === 'portfolio' ? 'Gallery' : 'Journal'}`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl uppercase tracking-widest mb-6">Existing Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'portfolio' ? (
              portfolio.map(item => (
                <div key={item.id} className="bg-white p-4 border border-[#E5E0D5] flex items-center space-x-4 overflow-hidden">
                  <div className="relative aspect-[9/16] w-12 flex-shrink-0 overflow-hidden shadow-sm">
                    <img src={item.imageUrls[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] uppercase text-[#A09885]">{item.category}</p>
                    <h4 className="serif text-lg truncate break-all">{item.title}</h4>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={() => handleEditPortfolio(item)} className="p-2 text-[#706C61] hover:text-black">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => onDeleteItem(item.id)} className="p-2 text-red-300 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              blogs.map(blog => (
                <div key={blog.id} className="bg-white p-4 border border-[#E5E0D5] flex items-center space-x-4 overflow-hidden">
                  <div className="relative aspect-[9/16] w-12 flex-shrink-0 overflow-hidden shadow-sm">
                    <img src={blog.imageUrls[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] uppercase text-[#A09885]">{blog.date}</p>
                    <h4 className="serif text-lg truncate break-all">{blog.title}</h4>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={() => handleEditBlog(blog)} className="p-2 text-[#706C61] hover:text-black">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => onDeleteBlog(blog.id)} className="p-2 text-red-300 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App
const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('elena_portfolio_v3');
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
    } catch (e) { return INITIAL_PORTFOLIO; }
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('elena_blogs_v3');
      return saved ? JSON.parse(saved) : INITIAL_BLOGS;
    } catch (e) { return INITIAL_BLOGS; }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('elena_auth') === 'true');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('elena_portfolio_v3', JSON.stringify(portfolio));
      localStorage.setItem('elena_blogs_v3', JSON.stringify(blogs));
    } catch (e) { console.error("Quota full?"); }
  }, [portfolio, blogs]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-[#E5E0D5]">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage portfolio={portfolio} blogs={blogs} onItemClick={setSelectedProject} onBlogClick={setSelectedBlog} />} />
            <Route path="/apparel" element={<CategoryPage category={Category.APPAREL} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/fibre" element={<CategoryPage category={Category.FIBRE} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/visual" element={<CategoryPage category={Category.VISUAL} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/journal" element={<JournalPage blogs={blogs} onBlogClick={setSelectedBlog} />} />
            <Route path="/admin" element={
              isLoggedIn ? (
                <AdminDashboard 
                  portfolio={portfolio} 
                  blogs={blogs} 
                  onLogout={() => { setIsLoggedIn(false); localStorage.removeItem('elena_auth'); }}
                  onAddItem={(item) => setPortfolio([item, ...portfolio])}
                  onAddBlog={(blog) => setBlogs([blog, ...blogs])}
                  onDeleteItem={(id) => setPortfolio(portfolio.filter(p => p.id !== id))}
                  onDeleteBlog={(id) => setBlogs(blogs.filter(b => b.id !== id))}
                  onUpdateItem={(id, updated) => setPortfolio(portfolio.map(p => p.id === id ? updated : p))}
                  onUpdateBlog={(id, updated) => setBlogs(blogs.map(b => b.id === id ? updated : b))}
                />
              ) : (
                <AdminLogin onLogin={() => { setIsLoggedIn(true); localStorage.setItem('elena_auth', 'true'); }} />
              )
            } />
          </Routes>
        </div>
        <Footer />
        <PortfolioGallery item={selectedProject} onClose={() => setSelectedProject(null)} />
        <BlogDetail post={selectedBlog} onClose={() => setSelectedBlog(null)} />
      </div>
    </Router>
  );
};

export default App;
