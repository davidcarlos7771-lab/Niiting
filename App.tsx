
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import JournalCard from './components/JournalCard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PortfolioGallery from './components/PortfolioGallery';
import { Category, PortfolioItem, BlogPost, SiteSettings, Subscriber } from './types';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS, INITIAL_SETTINGS, K, SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';
import { X, CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const Toast: React.FC<{ message: string; type?: 'success' | 'warning'; onClose: () => void }> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-10 right-10 z-[200] px-6 py-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300 ${type === 'warning' ? 'bg-amber-100 text-amber-900' : 'bg-[#2C2C2C] text-white'}`}>
      {type === 'warning' ? <AlertTriangle size={20} className="text-amber-600" /> : <CheckCircle2 size={20} className="text-green-400" />}
      <p className="text-xs uppercase tracking-widest">{message}</p>
      <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Footer: React.FC<{ onSubscribe: (email: string) => void, settings: SiteSettings['footer'] }> = ({ onSubscribe, settings }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      onSubscribe(email);
      setEmail('');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <footer className="bg-[#2C2C2C] text-[#F9F7F2] py-20 px-4 md:px-12 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-12">
        <div className="flex-1">
          <h3 className="text-2xl serif mb-6">{settings.subscribeTitle}</h3>
          <div className="flex border-b border-[#706C61] pb-2 max-w-sm mx-auto md:mx-0">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-[#706C61]" 
            />
            <button 
              onClick={handleSubscribe}
              className="text-xs uppercase tracking-widest hover:text-[#A09885] transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <Link 
            to="/studio" 
            className="text-xs uppercase tracking-[0.3em] text-[#A09885] mb-4 hover:opacity-70 transition-opacity"
          >
            {settings.contactTag}
          </Link>
          <p className="text-lg serif italic tracking-wide">{settings.contactEmail}</p>
        </div>
      </div>
    </footer>
  );
};

const CategoryPage: React.FC<{ category: Category; items: PortfolioItem[]; onItemClick: (item: PortfolioItem) => void; title: string; subtitle: string }> = ({ category, items, onItemClick, title, subtitle }) => {
  const filteredItems = items.filter(item => item.category === category);
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"><p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{subtitle}</p><h2 className="text-5xl serif italic">{title}</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">{filteredItems.map((item) => (<div key={item.id} className="cursor-pointer group flex flex-col" onClick={() => onItemClick(item)}><div className="aspect-[9/16] overflow-hidden mb-6 bg-[#E5E0D5] relative shadow-sm"><img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div><p className="text-[10px] uppercase tracking-widest text-[#706C61] mb-2">{item.subtitle}</p><h3 className="text-xl serif mb-2 group-hover:italic transition-all">{item.title}</h3></div>))}</div>
      </div>
    </div>
  );
};

const JournalPage: React.FC<{ blogs: BlogPost[]; onBlogClick: (blog: BlogPost) => void; title: string; subtitle: string }> = ({ blogs, onBlogClick, title, subtitle }) => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-[#F9F7F2] animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"><p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{subtitle}</p><h2 className="text-5xl serif italic">{title}</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">{blogs.map((post) => (<JournalCard key={post.id} post={post} onClick={onBlogClick} />))}</div>
      </div>
    </div>
  );
};

const BlogDetail: React.FC<{ post: BlogPost | null; onClose: () => void }> = ({ post, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (post) setCurrentIndex(0);
  }, [post]);

  if (!post) return null;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % post.imageUrls.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + post.imageUrls.length) % post.imageUrls.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#F9F7F2]/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-2 text-[#2C2C2C] hover:scale-110 transition-transform hidden md:block z-[110]"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <div className="w-full max-w-7xl px-4 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12 py-12" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Side: Image/Carousel */}
        <div className="w-full md:w-auto flex justify-center relative group">
            <div className="aspect-[9/16] h-[70vh] md:h-[80vh] overflow-hidden bg-[#E5E0D5] shadow-2xl relative">
                <img src={post.imageUrls[currentIndex]} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" alt={post.title} />
                
                {post.imageUrls.length > 1 && (
                    <>
                    <button onClick={prev} className="absolute left-[-20px] md:left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronLeft size={24} /></button>
                    <button onClick={next} className="absolute right-[-20px] md:right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-colors shadow-sm"><ChevronRight size={24} /></button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {post.imageUrls.map((_, idx) => (
                        <div key={idx} className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#2C2C2C]' : 'w-2 bg-[#2C2C2C]/20'}`} />
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="w-full md:w-1/3 text-left bg-white/50 p-6 md:bg-transparent md:p-0 rounded-lg self-center">
          <div className="flex items-center gap-4 mb-2">
             <p className="text-xs uppercase tracking-[0.2em] text-[#706C61]">{post.date}</p>
          </div>
          <h2 className="text-3xl md:text-5xl serif mb-4 leading-tight">{post.title}</h2>
          <div className="w-12 h-[1px] bg-[#2C2C2C] mb-6"></div>
          
          <div className="prose prose-stone max-h-[40vh] overflow-y-auto pr-2 custom-scroll">
            <div className="text-[#2C2C2C] font-light leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#E5E0D5]">
             <p className="text-[10px] text-[#A09885] uppercase tracking-tighter">
              Slide {currentIndex + 1} of {post.imageUrls.length}
            </p>
            <button onClick={onClose} className="md:hidden text-xs uppercase tracking-widest border-b border-black pb-1">Tap to close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC<{ portfolio: PortfolioItem[], blogs: BlogPost[], siteSettings: SiteSettings, onItemClick: (item: PortfolioItem) => void, onBlogClick: (blog: BlogPost) => void }> = ({ portfolio, blogs, siteSettings, onItemClick, onBlogClick }) => {
  const featuredBlog = blogs.find(b => b.pinned) || blogs[0];
  const otherBlogs = blogs.filter(b => b.id !== featuredBlog?.id).slice(0, 4);

  return (
    <div className="animate-in fade-in duration-700">
      <Hero settings={siteSettings.hero} />
      <CategorySection category={Category.APPAREL} items={portfolio} link="/apparel" onItemClick={onItemClick} customTitle={siteSettings.homeSections.apparelTitle} customTag={siteSettings.homeSections.apparelTag} buttonText={siteSettings.homeSections.apparelButtonText} />
      <CategorySection category={Category.FIBRE} items={portfolio} link="/fibre" onItemClick={onItemClick} customTitle={siteSettings.homeSections.fibreTitle} customTag={siteSettings.homeSections.fibreTag} buttonText={siteSettings.homeSections.fibreButtonText} />
      <CategorySection category={Category.VISUAL} items={portfolio} link="/visual" onItemClick={onItemClick} customTitle={siteSettings.homeSections.visualTitle} customTag={siteSettings.homeSections.visualTag} buttonText={siteSettings.homeSections.visualButtonText} />
      <section className="py-24 px-4 md:px-12 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16"><p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{siteSettings.homeSections.archiveTag}</p><h2 className="text-4xl serif italic">{siteSettings.homeSections.archiveTitle}</h2></div>
          {featuredBlog && (
             <div className="flex justify-center mb-12">
                <div className="relative w-full md:w-[500px] aspect-square group cursor-pointer overflow-hidden shadow-lg bg-[#E5E0D5]" onClick={() => onBlogClick(featuredBlog)}>
                   <img src={featuredBlog.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={featuredBlog.title}/>
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 flex items-end md:items-center justify-center p-6 md:p-12 text-center">
                     <div><p className="text-[10px] uppercase tracking-widest text-white/90 mb-3">{featuredBlog.date}</p><h3 className="text-2xl md:text-4xl text-white serif leading-tight line-clamp-2 drop-shadow-md">{featuredBlog.title}</h3><button className="mt-6 text-[10px] text-white uppercase tracking-widest border-b border-white/50 pb-1 hidden md:inline-block">READ THE STORY</button></div>
                   </div>
                </div>
             </div>
          )}
          {otherBlogs.length > 0 && <div className="hidden lg:grid grid-cols-4 gap-8">{otherBlogs.map(post => (<JournalCard key={post.id} post={post} onClick={onBlogClick} />))}</div>}
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: 'success' | 'warning'}>({ msg: '', type: 'success' });
  const [adminPassword, setAdminPassword] = useState<string>(K);

  // 1. Local Storage Persistence (Always runs as fallback/cache)
  useEffect(() => {
    try {
      const savedPortfolio = localStorage.getItem('portfolio');
      if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
      
      const savedBlogs = localStorage.getItem('blogs');
      if (savedBlogs) setBlogs(JSON.parse(savedBlogs));
      
      const savedSettings = localStorage.getItem('siteSettings');
      if (savedSettings) setSiteSettings(JSON.parse(savedSettings));

      const savedSubs = localStorage.getItem('subscribers');
      if (savedSubs) setSubscribers(JSON.parse(savedSubs));
    } catch (e) {
      console.error("Error reading from local storage:", e);
    }
  }, []);

  useEffect(() => {
    // Helper to safely save to localStorage
    const saveData = (key: string, data: any) => {
      try {
        const serialized = JSON.stringify(data);
        // Browser quota is typically 5MB (~5.2 million chars). 
        // We set a safe limit of ~4.5MB to avoid the crash.
        if (serialized.length > 4500000) {
           console.warn(`[Storage Warning] ${key} is too large (${(serialized.length / 1024 / 1024).toFixed(2)}MB) to save locally.`);
           // If we can't save locally, we just skip it. 
           // In a real app, this confirms the user MUST rely on Cloud (Supabase) for large data.
           // We'll show a one-time warning via Toast if it's the admin saving it.
           return false;
        }
        localStorage.setItem(key, serialized);
        return true;
      } catch (e) {
        console.error(`Error saving ${key}:`, e);
        return false;
      }
    };

    saveData('portfolio', portfolio);
    saveData('blogs', blogs);
    const settingsSaved = saveData('siteSettings', siteSettings);
    saveData('subscribers', subscribers);
    
    // Only warn if settings failed (since that's where large images usually are)
    // We check if it's likely due to size to provide feedback, but we don't spam toasts here
    // as this runs on every render.
    
    // Apply favicon and title
    document.title = siteSettings.tabTitle;
    if (siteSettings.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.faviconUrl;
    }
  }, [portfolio, blogs, siteSettings, subscribers]);

  // 2. Supabase Client Integration
  const supabase = useMemo(() => {
    const url = SUPABASE_URL || siteSettings.integrations.supabaseUrl;
    const key = SUPABASE_ANON_KEY || siteSettings.integrations.supabaseAnonKey;

    if (url && key) {
      try {
        return createClient(url, key);
      } catch (e) {
        console.error("Invalid Supabase credentials");
        return null;
      }
    }
    return null;
  }, [siteSettings.integrations.supabaseUrl, siteSettings.integrations.supabaseAnonKey]);

  // 3. Sync Data from Supabase on Load
  useEffect(() => {
    if (!supabase) return;
    
    const fetchSupabaseData = async () => {
      try {
        const { data: pData } = await supabase.from('portfolio').select('*');
        if (pData && pData.length > 0) setPortfolio(pData);
        
        const { data: bData } = await supabase.from('blogs').select('*');
        if (bData && bData.length > 0) setBlogs(bData);
        
        const { data: sData } = await supabase.from('subscribers').select('*');
        if (sData && sData.length > 0) setSubscribers(sData);

        const { data: cData } = await supabase.from('site_config').select('*').eq('id', 'global').single();
        if (cData) {
          if (cData.settings) setSiteSettings(cData.settings);
          if (cData.admin_password) setAdminPassword(cData.admin_password);
        }
      } catch (err) {
        console.error("Cloud fetch error:", err);
      }
    };
    
    fetchSupabaseData();
  }, [supabase]);

  // Sorting Logic
  const sortedPortfolio = useMemo(() => {
      return [...portfolio].sort((a, b) => {
        if (a.pinned === b.pinned) {
            return b.createdAt - a.createdAt;
        }
        return a.pinned ? -1 : 1;
      });
  }, [portfolio]);

  const sortedBlogs = useMemo(() => {
      return [...blogs].sort((a, b) => {
        if (a.pinned === b.pinned) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.pinned ? -1 : 1;
      });
  }, [blogs]);

  const showToast = (msg: string, type: 'success' | 'warning' = 'success') => setToastMessage({ msg, type });

  const handleLogin = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => setIsAdmin(false);

  // --- Handlers with Supabase Sync ---

  const handleSubscribe = async (email: string) => {
    if (subscribers.some(s => s.email === email)) {
      showToast("Already subscribed!");
      return;
    }
    const newSub: Subscriber = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      date: new Date().toISOString()
    };
    
    setSubscribers([...subscribers, newSub]);
    if (supabase) await supabase.from('subscribers').insert([newSub]);
    
    showToast("Thank you for subscribing.");
  };

  const handleAddItem = async (item: PortfolioItem) => {
    setPortfolio([item, ...portfolio]);
    if (supabase) await supabase.from('portfolio').insert([item]);
    showToast("Asset added.");
  };

  const handleAddBlog = async (blog: BlogPost) => {
    setBlogs([blog, ...blogs]);
    if (supabase) await supabase.from('blogs').insert([blog]);
    showToast("Entry published.");
  };

  const handleDeleteItem = async (id: string) => {
    setPortfolio(portfolio.filter(i => i.id !== id));
    if (supabase) await supabase.from('portfolio').delete().eq('id', id);
    showToast("Asset removed.");
  };

  const handleDeleteBlog = async (id: string) => {
    setBlogs(blogs.filter(b => b.id !== id));
    if (supabase) await supabase.from('blogs').delete().eq('id', id);
    showToast("Entry deleted.");
  };

  const handleUpdateItem = async (id: string, updated: PortfolioItem) => {
    setPortfolio(portfolio.map(i => i.id === id ? updated : i));
    if (supabase) await supabase.from('portfolio').update(updated).eq('id', id);
    showToast("Asset updated.");
  };

  const handleUpdateBlog = async (id: string, updated: BlogPost) => {
    setBlogs(blogs.map(b => b.id === id ? updated : b));
    if (supabase) await supabase.from('blogs').update(updated).eq('id', id);
    showToast("Entry updated.");
  };

  const handleTogglePinItem = async (id: string) => {
    const updated = portfolio.find(i => i.id === id);
    if (updated) {
        const newItem = { ...updated, pinned: !updated.pinned };
        setPortfolio(portfolio.map(i => i.id === id ? newItem : i));
        if (supabase) await supabase.from('portfolio').update({ pinned: newItem.pinned }).eq('id', id);
    }
  };

  const handleTogglePinBlog = async (id: string) => {
    const updated = blogs.find(b => b.id === id);
    if (updated) {
        const newBlog = { ...updated, pinned: !updated.pinned };
        setBlogs(blogs.map(b => b.id === id ? newBlog : b));
        if (supabase) await supabase.from('blogs').update({ pinned: newBlog.pinned }).eq('id', id);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    setSubscribers(subscribers.filter(s => s.id !== id));
    if (supabase) await supabase.from('subscribers').delete().eq('id', id);
    showToast("Subscriber removed.");
  };

  const handleUpdateSettings = async (newSettings: SiteSettings) => {
    // 1. Calculate size to warn user immediately if it's too big for local storage
    const size = JSON.stringify(newSettings).length;
    const isTooBig = size > 4500000;

    setSiteSettings(newSettings);
    
    // Persist to Supabase
    if (supabase) {
        await supabase.from('site_config').upsert({ 
            id: 'global', 
            settings: newSettings,
        }, { onConflict: 'id' });
    }

    if (isTooBig) {
        showToast("Saved to Cloud. Images too large for local cache.", 'warning');
    } else {
        showToast("Configuration saved.");
    }
  };

  const handleUpdatePassword = (old: string, updated: string) => {
    if (old === adminPassword) {
      setAdminPassword(updated);
      if (supabase) {
          supabase.from('site_config').upsert({ 
              id: 'global', 
              admin_password: updated 
          }, { onConflict: 'id' }).then(({ error }) => {
              if (error) console.error("Failed to update password cloud", error);
          });
      }
      showToast("Password updated.");
      return true;
    }
    return false;
  };

  const handleImportData = (data: any) => {
    if (data.portfolio) setPortfolio(data.portfolio);
    if (data.blogs) setBlogs(data.blogs);
    if (data.siteSettings) setSiteSettings(data.siteSettings);
    showToast("System restored from backup.");
  };

  // Safe header defaults in case old state exists
  const headers = siteSettings.pageHeaders || INITIAL_SETTINGS.pageHeaders;

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F9F7F2] text-[#2C2C2C] selection:bg-[#E5E0D5] selection:text-[#2C2C2C] font-sans">
        <Navbar settings={siteSettings.navbar} />
        
        <Routes>
          <Route path="/" element={<HomePage portfolio={sortedPortfolio} blogs={sortedBlogs} siteSettings={siteSettings} onItemClick={setSelectedItem} onBlogClick={setSelectedBlog} />} />
          <Route path="/apparel" element={<CategoryPage category={Category.APPAREL} items={sortedPortfolio} onItemClick={setSelectedItem} title={headers.apparelTitle} subtitle={headers.apparelSubtitle} />} />
          <Route path="/fibre" element={<CategoryPage category={Category.FIBRE} items={sortedPortfolio} onItemClick={setSelectedItem} title={headers.fibreTitle} subtitle={headers.fibreSubtitle} />} />
          <Route path="/visual" element={<CategoryPage category={Category.VISUAL} items={sortedPortfolio} onItemClick={setSelectedItem} title={headers.visualTitle} subtitle={headers.visualSubtitle} />} />
          <Route path="/journal" element={<JournalPage blogs={sortedBlogs} onBlogClick={setSelectedBlog} title={headers.journalTitle} subtitle={headers.journalSubtitle} />} />
          <Route path="/studio" element={
            isAdmin ? (
              <AdminDashboard 
                portfolio={sortedPortfolio} 
                blogs={sortedBlogs} 
                subscribers={subscribers} 
                siteSettings={siteSettings}
                onLogout={handleLogout}
                onAddItem={handleAddItem}
                onAddBlog={handleAddBlog}
                onDeleteItem={handleDeleteItem}
                onDeleteBlog={handleDeleteBlog}
                onUpdateItem={handleUpdateItem}
                onUpdateBlog={handleUpdateBlog}
                onTogglePinItem={handleTogglePinItem}
                onTogglePinBlog={handleTogglePinBlog}
                onDeleteSubscriber={handleDeleteSubscriber}
                onUpdateSettings={handleUpdateSettings}
                onUpdatePassword={handleUpdatePassword}
                onImportData={handleImportData}
              />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          } />
        </Routes>

        <Footer onSubscribe={handleSubscribe} settings={siteSettings.footer} />

        <PortfolioGallery item={selectedItem} onClose={() => setSelectedItem(null)} />
        {selectedBlog && <BlogDetail post={selectedBlog} onClose={() => setSelectedBlog(null)} />}
        
        {toastMessage.msg && <Toast message={toastMessage.msg} type={toastMessage.type} onClose={() => setToastMessage({ msg: '', type: 'success' })} />}
      </div>
    </Router>
  );
};

export default App;
