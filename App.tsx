
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import JournalCard from './components/JournalCard';
import AdminLogin from './components/AdminLogin';
import PortfolioGallery from './components/PortfolioGallery';
import { Category, PortfolioItem, BlogPost, SiteSettings } from './types';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS, INITIAL_SETTINGS } from './constants';
import { Plus, Trash2, Camera, LogOut, Image as ImageIcon, X, Edit3, ChevronLeft, ChevronRight, Mail, Users, CheckCircle2, Settings } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  date: string;
}

// Notification Component
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-10 right-10 z-[200] bg-[#2C2C2C] text-white px-6 py-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300">
      <CheckCircle2 size={20} className="text-green-400" />
      <p className="text-xs uppercase tracking-widest">{message}</p>
      <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

// Shared Components
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
          <p className="text-xs uppercase tracking-[0.3em] text-[#A09885] mb-2">{settings.contactTag}</p>
          <p className="text-lg serif italic tracking-wide">{settings.contactEmail}</p>
        </div>
      </div>
    </footer>
  );
};

// Admin Component
const AdminDashboard: React.FC<{ 
  portfolio: PortfolioItem[], 
  blogs: BlogPost[], 
  subscribers: Subscriber[],
  siteSettings: SiteSettings,
  onLogout: () => void,
  onAddItem: (item: PortfolioItem) => void,
  onAddBlog: (blog: BlogPost) => void,
  onDeleteItem: (id: string) => void,
  onDeleteBlog: (id: string) => void,
  onUpdateItem: (id: string, item: PortfolioItem) => void,
  onUpdateBlog: (id: string, blog: BlogPost) => void,
  onDeleteSubscriber: (id: string) => void,
  onUpdateSubscriber: (id: string, email: string) => void,
  onUpdateSettings: (settings: SiteSettings) => void
}> = ({ 
  portfolio, blogs, subscribers, siteSettings, onLogout, 
  onAddItem, onAddBlog, onDeleteItem, onDeleteBlog, onUpdateItem, onUpdateBlog,
  onDeleteSubscriber, onUpdateSubscriber, onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'subscribers' | 'settings'>('portfolio');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Portfolio/Blog Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.APPAREL);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  // Global Settings Form State
  const [tempSettings, setTempSettings] = useState<SiteSettings>(siteSettings);

  useEffect(() => {
    if (!editingId) {
      setNewDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      setNewAuthor('Elena');
    }
  }, [activeTab, editingId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'form' | 'heroLeft' | 'heroRight') => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'form') {
          setNewImages(prev => [...prev, result]);
        } else if (target === 'heroLeft') {
          setTempSettings({ ...tempSettings, hero: { ...tempSettings.hero, imageLeft: result } });
        } else if (target === 'heroRight') {
          setTempSettings({ ...tempSettings, hero: { ...tempSettings.hero, imageRight: result } });
        }
      };
      reader.readAsDataURL(files[0]);
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

  const handleModifySubscriber = (sub: Subscriber) => {
    const newEmail = prompt('Enter new email address:', sub.email);
    if (newEmail && newEmail !== sub.email && newEmail.includes('@')) {
      onUpdateSubscriber(sub.id, newEmail);
    }
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
            <h2 className="text-xl uppercase tracking-widest">
              {activeTab === 'subscribers' ? 'Records' : (activeTab === 'settings' ? 'Global Settings' : (editingId ? 'Edit' : 'Create New'))}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-[10px] uppercase border-b border-black">Cancel Edit</button>
            )}
          </div>
          
          <div className="flex bg-[#F9F7F2] p-1 mb-6 rounded flex-wrap gap-1">
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
            <button 
              type="button"
              onClick={() => { setActiveTab('subscribers'); resetForm(); }} 
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'subscribers' ? 'bg-white shadow-sm font-bold' : 'text-[#A09885]'}`}
            >
              Users
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('settings'); resetForm(); }} 
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'settings' ? 'bg-white shadow-sm font-bold' : 'text-[#A09885]'}`}
            >
              Site
            </button>
          </div>

          {activeTab === 'portfolio' || activeTab === 'blog' ? (
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
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'form')} className="absolute inset-0 opacity-0 cursor-pointer" />
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
          ) : activeTab === 'settings' ? (
            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
              <div className="bg-[#F9F7F2] p-4 rounded border border-[#E5E0D5]">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Header & Footer</h3>
                <div className="space-y-3">
                  <input 
                    placeholder="Logo Text" 
                    value={tempSettings.navbar.logo} 
                    onChange={e => setTempSettings({...tempSettings, navbar: {...tempSettings.navbar, logo: e.target.value}})}
                    className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                  />
                  <input 
                    placeholder="Logo Subtitle" 
                    value={tempSettings.navbar.subtitle} 
                    onChange={e => setTempSettings({...tempSettings, navbar: {...tempSettings.navbar, subtitle: e.target.value}})}
                    className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                  />
                  <input 
                    placeholder="Contact Tag (e.g. TALK TO ME)" 
                    value={tempSettings.footer.contactTag} 
                    onChange={e => setTempSettings({...tempSettings, footer: {...tempSettings.footer, contactTag: e.target.value}})}
                    className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                  />
                  <input 
                    placeholder="Contact Email" 
                    value={tempSettings.footer.contactEmail} 
                    onChange={e => setTempSettings({...tempSettings, footer: {...tempSettings.footer, contactEmail: e.target.value}})}
                    className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                  />
                </div>
              </div>

              <button 
                type="button"
                onClick={() => { onUpdateSettings(tempSettings); alert("Site settings saved!"); }}
                className="w-full py-4 bg-[#2C2C2C] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors"
              >
                Save All Site Settings
              </button>
            </div>
          ) : (
            <div className="text-center p-8 bg-[#F9F7F2]">
              <Users size={32} className="mx-auto mb-4 text-[#A09885]" />
              <h3 className="text-lg serif italic">Review Subscriber Data</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#706C61] mt-2">Managing your audience list</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'settings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="bg-white p-6 border border-[#E5E0D5] rounded shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 border-b border-[#E5E0D5] pb-2">Hero Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Tagline</label>
                        <input value={tempSettings.hero.tag} onChange={e => setTempSettings({...tempSettings, hero: {...tempSettings.hero, tag: e.target.value}})} className="w-full p-2 border text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Hero Title</label>
                        <textarea value={tempSettings.hero.title} onChange={e => setTempSettings({...tempSettings, hero: {...tempSettings.hero, title: e.target.value}})} className="w-full p-2 border text-xs" rows={2} />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Description</label>
                        <textarea value={tempSettings.hero.description} onChange={e => setTempSettings({...tempSettings, hero: {...tempSettings.hero, description: e.target.value}})} className="w-full p-2 border text-xs" rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase text-[#706C61] mb-1">Left Image</label>
                          <div className="relative aspect-square overflow-hidden bg-[#F9F7F2] border mb-2">
                             <img src={tempSettings.hero.imageLeft} className="w-full h-full object-cover" />
                             <input type="file" onChange={e => handleImageUpload(e, 'heroLeft')} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-[#706C61] mb-1">Right Image</label>
                          <div className="relative aspect-square overflow-hidden bg-[#F9F7F2] border mb-2">
                             <img src={tempSettings.hero.imageRight} className="w-full h-full object-cover" />
                             <input type="file" onChange={e => handleImageUpload(e, 'heroRight')} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 border border-[#E5E0D5] rounded shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 border-b border-[#E5E0D5] pb-2">Home Page Sections</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Apparel Section Title</label>
                        <input value={tempSettings.homeSections.apparelTitle} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, apparelTitle: e.target.value}})} className="w-full p-2 border text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Fibre Section Title</label>
                        <input value={tempSettings.homeSections.fibreTitle} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, fibreTitle: e.target.value}})} className="w-full p-2 border text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Visual Section Title</label>
                        <input value={tempSettings.homeSections.visualTitle} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, visualTitle: e.target.value}})} className="w-full p-2 border text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Journal Section Title</label>
                        <input value={tempSettings.homeSections.archiveTitle} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, archiveTitle: e.target.value}})} className="w-full p-2 border text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Journal Section Tag</label>
                        <input value={tempSettings.homeSections.archiveTag} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, archiveTag: e.target.value}})} className="w-full p-2 border text-xs" />
                      </div>
                    </div>
                </div>
                <div className="bg-white p-6 border border-[#E5E0D5] rounded shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 border-b border-[#E5E0D5] pb-2">Subscription Box</h3>
                    <div>
                      <label className="block text-[10px] uppercase text-[#706C61] mb-1">Title Text</label>
                      <textarea value={tempSettings.footer.subscribeTitle} onChange={e => setTempSettings({...tempSettings, footer: {...tempSettings.footer, subscribeTitle: e.target.value}})} className="w-full p-2 border text-xs" rows={2} />
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl uppercase tracking-widest mb-6">
                {activeTab === 'subscribers' ? 'Mailing List' : 'Existing Items'}
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {activeTab === 'portfolio' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolio.map(item => (
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
                    ))}
                  </div>
                )}
                
                {activeTab === 'blog' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogs.map(blog => (
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
                    ))}
                  </div>
                )}

                {activeTab === 'subscribers' && (
                  <div className="bg-white border border-[#E5E0D5] overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#F9F7F2] border-b border-[#E5E0D5]">
                          <th className="p-4 uppercase tracking-widest text-[10px] font-bold">#</th>
                          <th className="p-4 uppercase tracking-widest text-[10px] font-bold">Email Address</th>
                          <th className="p-4 uppercase tracking-widest text-[10px] font-bold">Subscribed Date</th>
                          <th className="p-4 uppercase tracking-widest text-[10px] font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.length > 0 ? (
                          subscribers.map((sub, idx) => (
                            <tr key={sub.id} className="border-b border-[#E5E0D5] last:border-0 hover:bg-[#F9F7F2]/50 transition-colors">
                              <td className="p-4 text-[#A09885] text-xs">{idx + 1}</td>
                              <td className="p-4 font-medium break-all">{sub.email}</td>
                              <td className="p-4 text-[#706C61] text-xs whitespace-nowrap">{sub.date}</td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <button 
                                  onClick={() => handleModifySubscriber(sub)}
                                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-blue-600 hover:text-blue-800 mr-4 font-semibold"
                                >
                                  <Edit3 size={12} /> Modify
                                </button>
                                <button 
                                  onClick={() => onDeleteSubscriber(sub.id)}
                                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 font-semibold"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-12 text-center text-[#706C61] italic">No subscribers yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// HomePage Component
const HomePage: React.FC<{ 
  portfolio: PortfolioItem[], 
  blogs: BlogPost[], 
  siteSettings: SiteSettings,
  onItemClick: (item: PortfolioItem) => void,
  onBlogClick: (blog: BlogPost) => void 
}> = ({ portfolio, blogs, siteSettings, onItemClick, onBlogClick }) => {
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const otherBlogs = blogs.slice(1, 5);

  return (
    <div className="animate-in fade-in duration-700">
      <Hero settings={siteSettings.hero} />
      <CategorySection 
        category={Category.APPAREL} 
        items={portfolio} 
        link="/apparel" 
        onItemClick={onItemClick} 
        customTitle={siteSettings.homeSections.apparelTitle}
      />
      <CategorySection 
        category={Category.FIBRE} 
        items={portfolio} 
        link="/fibre" 
        onItemClick={onItemClick} 
        customTitle={siteSettings.homeSections.fibreTitle}
      />
      <CategorySection 
        category={Category.VISUAL} 
        items={portfolio} 
        link="/visual" 
        onItemClick={onItemClick} 
        customTitle={siteSettings.homeSections.visualTitle}
      />
      
      <section className="py-24 px-4 md:px-12 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{siteSettings.homeSections.archiveTag}</p>
            <h2 className="text-4xl serif italic">{siteSettings.homeSections.archiveTitle}</h2>
          </div>

          {featuredBlog && (
            <div 
              className="relative aspect-square w-full lg:max-w-4xl mx-auto mb-12 cursor-pointer group overflow-hidden shadow-2xl"
              onClick={() => onBlogClick(featuredBlog)}
            >
              <img 
                src={featuredBlog.imageUrls[0]} 
                alt={featuredBlog.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12 text-white">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80 mb-4 line-clamp-2">{featuredBlog.date}</p>
                <h3 className="text-3xl md:text-6xl serif mb-6 leading-tight break-words line-clamp-2">{featuredBlog.title}</h3>
                <p className="text-sm md:text-lg opacity-90 line-clamp-2 font-light max-w-2xl leading-relaxed break-words">
                  {featuredBlog.content}
                </p>
                <div className="mt-8">
                  <span className="text-[10px] uppercase tracking-widest border-b border-white pb-1">Read Full Entry</span>
                </div>
              </div>
            </div>
          )}

          <div className="hidden lg:grid grid-cols-4 gap-8">
            {otherBlogs.map(post => (
              <JournalCard key={post.id} post={post} onClick={onBlogClick} />
            ))}
          </div>

          <div className="text-center mt-20">
            <Link to="/journal" className="inline-block px-10 py-3 border border-[#2C2C2C] text-xs uppercase tracking-widest hover:bg-[#2C2C2C] hover:text-white transition-all">
              Explore Complete Journal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// CategoryPage Component
const CategoryPage: React.FC<{ 
  category: Category, 
  items: PortfolioItem[], 
  onItemClick: (item: PortfolioItem) => void 
}> = ({ category, items, onItemClick }) => {
  const filteredItems = items.filter(item => item.category === category);
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in">
      <div className="text-center mb-20">
        <h1 className="text-5xl serif mb-4">{category}</h1>
        <p className="text-xs uppercase tracking-[0.3em] text-[#A09885]">The Complete Collection</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="flex flex-col cursor-pointer group" onClick={() => onItemClick(item)}>
            <div className="aspect-[9/16] overflow-hidden mb-6 bg-[#E5E0D5] relative shadow-sm">
              <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#706C61] mb-2 break-all line-clamp-2 min-h-[1.5em]">{item.subtitle}</p>
            <h3 className="text-xl serif mb-4 group-hover:italic transition-all break-all line-clamp-2 min-h-[2.4em]">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

// JournalPage Component
const JournalPage: React.FC<{ 
  blogs: BlogPost[], 
  onBlogClick: (blog: BlogPost) => void 
}> = ({ blogs, onBlogClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in">
      <div className="text-center mb-20">
        <h1 className="text-5xl serif mb-4">Journal</h1>
        <p className="text-xs uppercase tracking-[0.3em] text-[#A09885]">Notes on a creative life</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {blogs.map(post => (
          <JournalCard key={post.id} post={post} onClick={onBlogClick} />
        ))}
      </div>
    </div>
  );
};

// BlogDetail Component
const BlogDetail: React.FC<{ 
  post: BlogPost | null, 
  onClose: () => void 
}> = ({ post, onClose }) => {
  if (!post) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-[#F9F7F2] overflow-y-auto animate-in slide-in-from-bottom duration-500">
      <button onClick={onClose} className="fixed top-8 right-8 p-2 text-[#2C2C2C] hover:scale-110 transition-transform z-[110]">
        <X size={32} strokeWidth={1} />
      </button>
      <div className="max-w-4xl mx-auto px-4 py-32">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-[#A09885] mb-4">{post.date}</p>
          <h1 className="text-4xl md:text-6xl serif leading-tight mb-8 break-all">{post.title}</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#706C61]">By {post.author}</p>
        </div>
        <div className="aspect-[16/9] mb-16 overflow-hidden bg-[#E5E0D5]">
          <img src={post.imageUrls[0]} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg leading-relaxed text-[#2C2C2C] font-light whitespace-pre-wrap break-all">{post.content}</p>
          {post.imageUrls.length > 1 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              {post.imageUrls.slice(1).map((img, idx) => (
                <div key={idx} className="aspect-[9/16] overflow-hidden">
                  <img src={img} className="w-full h-full object-cover" alt={`${post.title} gallery ${idx}`} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-20 pt-8 border-t border-[#E5E0D5] flex justify-center">
            <button onClick={onClose} className="px-10 py-3 border border-[#2C2C2C] text-xs uppercase tracking-widest hover:bg-[#2C2C2C] hover:text-white transition-all">
              Back to Journal
            </button>
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
      const saved = localStorage.getItem('elena_portfolio_v4');
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
    } catch (e) { return INITIAL_PORTFOLIO; }
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('elena_blogs_v4');
      return saved ? JSON.parse(saved) : INITIAL_BLOGS;
    } catch (e) { return INITIAL_BLOGS; }
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const saved = localStorage.getItem('elena_subscribers_v4');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('elena_settings_v4');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch (e) { return INITIAL_SETTINGS; }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('elena_auth') === 'true');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('elena_portfolio_v4', JSON.stringify(portfolio));
      localStorage.setItem('elena_blogs_v4', JSON.stringify(blogs));
      localStorage.setItem('elena_subscribers_v4', JSON.stringify(subscribers));
      localStorage.setItem('elena_settings_v4', JSON.stringify(siteSettings));
    } catch (e) { console.error("Quota full?"); }
  }, [portfolio, blogs, subscribers, siteSettings]);

  const handleSubscribe = (email: string) => {
    const newSub: Subscriber = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setSubscribers([newSub, ...subscribers]);
    setToastMessage('Successfully Submitted');
  };

  const handleDeleteSubscriber = (id: string) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      setSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  const handleUpdateSubscriber = (id: string, email: string) => {
    setSubscribers(subscribers.map(s => s.id === id ? { ...s, email } : s));
  };

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-[#E5E0D5]">
        <Navbar settings={siteSettings.navbar} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage portfolio={portfolio} blogs={blogs} siteSettings={siteSettings} onItemClick={setSelectedProject} onBlogClick={setSelectedBlog} />} />
            <Route path="/apparel" element={<CategoryPage category={Category.APPAREL} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/fibre" element={<CategoryPage category={Category.FIBRE} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/visual" element={<CategoryPage category={Category.VISUAL} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/journal" element={<JournalPage blogs={blogs} onBlogClick={setSelectedBlog} />} />
            <Route path="/admin" element={
              isLoggedIn ? (
                <AdminDashboard 
                  portfolio={portfolio} 
                  blogs={blogs} 
                  subscribers={subscribers}
                  siteSettings={siteSettings}
                  onLogout={() => { setIsLoggedIn(false); localStorage.removeItem('elena_auth'); }}
                  onAddItem={(item) => setPortfolio([item, ...portfolio])}
                  onAddBlog={(blog) => setBlogs([blog, ...blogs])}
                  onDeleteItem={(id) => setPortfolio(portfolio.filter(p => p.id !== id))}
                  onDeleteBlog={(id) => setBlogs(blogs.filter(b => b.id !== id))}
                  onUpdateItem={(id, updated) => setPortfolio(portfolio.map(p => p.id === id ? updated : p))}
                  onUpdateBlog={(id, updated) => setBlogs(blogs.map(b => b.id === id ? updated : b))}
                  onDeleteSubscriber={handleDeleteSubscriber}
                  onUpdateSubscriber={handleUpdateSubscriber}
                  onUpdateSettings={handleUpdateSettings}
                />
              ) : (
                <AdminLogin onLogin={() => { setIsLoggedIn(true); localStorage.setItem('elena_auth', 'true'); }} />
              )
            } />
          </Routes>
        </div>
        <Footer onSubscribe={handleSubscribe} settings={siteSettings.footer} />
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        <PortfolioGallery item={selectedProject} onClose={() => setSelectedProject(null)} />
        <BlogDetail post={selectedBlog} onClose={() => setSelectedBlog(null)} />
      </div>
    </Router>
  );
};

export default App;
