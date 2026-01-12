
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import JournalCard from './components/JournalCard';
import AdminLogin from './components/AdminLogin';
import PortfolioGallery from './components/PortfolioGallery';
import { Category, PortfolioItem, BlogPost, SiteSettings } from './types';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS, INITIAL_SETTINGS, K } from './constants';
import { Trash2, LogOut, Image as ImageIcon, X, Edit3, Users, CheckCircle2, Settings, Globe, ShieldCheck, Pin, PinOff, Download, Database, Mail, ChevronLeft, ChevronRight, Share2, Layout } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  date: string;
}

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
  onTogglePinItem: (id: string) => void,
  onTogglePinBlog: (id: string) => void,
  onDeleteSubscriber: (id: string) => void,
  onUpdateSettings: (settings: SiteSettings) => void,
  onUpdatePassword: (old: string, updated: string) => boolean,
  onImportData: (data: any) => void
}> = ({ 
  portfolio, blogs, subscribers, siteSettings, onLogout, 
  onAddItem, onAddBlog, onDeleteItem, onDeleteBlog, onUpdateItem, onUpdateBlog, onTogglePinItem, onTogglePinBlog,
  onDeleteSubscriber, onUpdateSettings, onUpdatePassword, onImportData
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'subscribers' | 'settings' | 'security'>('portfolio');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.APPAREL);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newAuthor, setNewAuthor] = useState('Elena');
  
  const [tempSettings, setTempSettings] = useState<SiteSettings>(siteSettings);

  useEffect(() => {
    if (!editingId && activeTab === 'blog') {
      setNewDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      setNewAuthor('Elena');
    }
  }, [activeTab, editingId]);

  const handleTabSwitch = (tab: typeof activeTab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'form' | 'heroLeft' | 'heroRight' | 'favicon' | 'logo') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (target === 'form') {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setNewImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'heroLeft') {
          setTempSettings(prev => ({ ...prev, hero: { ...prev.hero, imageLeft: result } }));
        } else if (target === 'heroRight') {
          setTempSettings(prev => ({ ...prev, hero: { ...prev.hero, imageRight: result } }));
        } else if (target === 'favicon') {
          setTempSettings(prev => ({ ...prev, faviconUrl: result }));
        } else if (target === 'logo') {
          setTempSettings(prev => ({ ...prev, navbar: { ...prev.navbar, logoImage: result } }));
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewSubtitle('');
    setNewDesc('');
    setNewImages([]);
    setEditingId(null);
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewSubtitle(item.subtitle || '');
    setNewDesc(item.description);
    setNewCategory(item.category);
    setNewImages(item.imageUrls);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditBlog = (blog: BlogPost) => {
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
      alert("Title and image are required Assets.");
      return;
    }
    if (activeTab === 'portfolio') {
      const item: PortfolioItem = {
        id: editingId || Math.random().toString(36).substr(2, 9),
        title: newTitle,
        subtitle: newSubtitle,
        description: newDesc,
        category: newCategory,
        imageUrls: newImages,
        createdAt: Date.now(),
        pinned: false
      };
      if (editingId) onUpdateItem(editingId, item); else onAddItem(item);
    } else {
      const blog: BlogPost = {
        id: editingId || Math.random().toString(36).substr(2, 9),
        title: newTitle,
        date: newDate,
        content: newDesc,
        imageUrls: newImages,
        author: newAuthor,
        pinned: false
      };
      if (editingId) onUpdateBlog(editingId, blog); else onAddBlog(blog);
    }
    resetForm();
  };

  const handleExportBackup = () => {
    const backupData = { portfolio, blogs, siteSettings, version: "7.7", exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studio_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.portfolio && data.siteSettings) {
            onImportData(data);
            alert("Restoration successful.");
          }
        } catch (err) { alert("Format error."); }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 min-h-screen animate-in fade-in">
      <div className="flex justify-between items-center mb-12 pb-6 border-b border-[#E5E0D5]">
        <h1 className="text-4xl serif tracking-tight">Studio Management</h1>
        <button onClick={onLogout} className="flex items-center text-xs uppercase tracking-widest text-[#706C61] hover:text-black transition-colors">
          <LogOut size={16} className="mr-2" /> End Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <button onClick={() => handleTabSwitch('portfolio')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'portfolio' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><ImageIcon size={14}/> Gallery Assets</button>
          <button onClick={() => handleTabSwitch('blog')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'blog' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><Edit3 size={14}/> Journal Assets</button>
          <button onClick={() => handleTabSwitch('subscribers')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'subscribers' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><Users size={14}/> Subscribers</button>
          <button onClick={() => handleTabSwitch('settings')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><Settings size={14}/> Site Config</button>
          <button onClick={() => handleTabSwitch('security')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'security' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><ShieldCheck size={14}/> Security</button>
        </div>

        <div className="lg:col-span-3 space-y-8">
            {activeTab === 'settings' ? (
              <div className="animate-in slide-in-from-right duration-500 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {/* Presence & Branding */}
                  <div className="space-y-8">
                    <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Globe size={14} /> Presence</h3>
                      <div className="space-y-6">
                        <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Tab Title</label><input value={tempSettings.tabTitle} onChange={e => setTempSettings({...tempSettings, tabTitle: e.target.value })} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Favicon</label>
                          <div className="flex gap-4 items-center mb-2">
                             {tempSettings.faviconUrl && (
                               <div className="w-12 h-12 bg-[#F9F7F2] border border-[#E5E0D5] p-2 flex items-center justify-center shrink-0">
                                 <img src={tempSettings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                               </div>
                             )}
                             <div className="relative border border-dashed border-[#E5E0D5] py-3 px-4 text-center hover:bg-[#F9F7F2] transition-colors cursor-pointer group flex-1">
                                <ImageIcon size={14} className="mx-auto mb-1 text-[#A09885]" />
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'favicon')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <p className="text-[8px] uppercase tracking-widest">Upload Icon</p>
                             </div>
                          </div>
                          <input value={tempSettings.faviconUrl} onChange={e => setTempSettings({...tempSettings, faviconUrl: e.target.value })} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none text-[#706C61]" placeholder="Or enter URL..." />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Share2 size={14} /> Identity & Socials</h3>
                      <div className="space-y-6">
                        <div>
                            <label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Navbar Logo Icon</label>
                            <div className="flex gap-4 items-center mb-2">
                             {tempSettings.navbar.logoImage && (
                               <div className="w-12 h-12 bg-[#F9F7F2] border border-[#E5E0D5] p-2 flex items-center justify-center shrink-0">
                                 <img src={tempSettings.navbar.logoImage} alt="Logo" className="w-full h-full object-contain" />
                               </div>
                             )}
                             <div className="relative border border-dashed border-[#E5E0D5] py-3 px-4 text-center hover:bg-[#F9F7F2] transition-colors cursor-pointer group flex-1">
                                <ImageIcon size={14} className="mx-auto mb-1 text-[#A09885]" />
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <p className="text-[8px] uppercase tracking-widest">Upload Logo</p>
                             </div>
                          </div>
                        </div>
                        <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Logo Text</label><input value={tempSettings.navbar.logo} onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, logo: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                        <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Subtitle</label><input value={tempSettings.navbar.subtitle} onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, subtitle: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                        <div className="pt-4 border-t border-[#E5E0D5]">
                           <div className="mb-3"><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Instagram URL</label><input value={tempSettings.navbar.socials.instagram} onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, socials: { ...tempSettings.navbar.socials, instagram: e.target.value } }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                           <div className="mb-3"><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Facebook URL</label><input value={tempSettings.navbar.socials.facebook} onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, socials: { ...tempSettings.navbar.socials, facebook: e.target.value } }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                           <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">YouTube URL</label><input value={tempSettings.navbar.socials.youtube} onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, socials: { ...tempSettings.navbar.socials, youtube: e.target.value } }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero & Sections */}
                  <div className="space-y-8">
                    <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b">Hero Content</h3>
                      <div className="space-y-6">
                        <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Hero Tag</label><input value={tempSettings.hero.tag} onChange={e => setTempSettings({...tempSettings, hero: { ...tempSettings.hero, tag: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                        <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Hero Title</label><input value={tempSettings.hero.title} onChange={e => setTempSettings({...tempSettings, hero: { ...tempSettings.hero, title: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                        <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Description</label><textarea rows={3} value={tempSettings.hero.description} onChange={e => setTempSettings({...tempSettings, hero: { ...tempSettings.hero, description: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none resize-none" /></div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative border border-dashed border-[#E5E0D5] h-32 flex flex-col items-center justify-center hover:bg-[#F9F7F2] transition-colors cursor-pointer group overflow-hidden">
                            {tempSettings.hero.imageLeft ? (
                                <>
                                    <img src={tempSettings.hero.imageLeft} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative z-10 flex flex-col items-center">
                                         <Edit3 size={16} className="mb-1 text-[#2C2C2C]" />
                                         <p className="text-[8px] uppercase tracking-widest font-bold text-[#2C2C2C]">Change Left</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon size={16} className="mx-auto mb-1 text-[#A09885]" />
                                    <p className="text-[8px] uppercase tracking-widest">Img Left</p>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroLeft')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                          </div>
                          <div className="relative border border-dashed border-[#E5E0D5] h-32 flex flex-col items-center justify-center hover:bg-[#F9F7F2] transition-colors cursor-pointer group overflow-hidden">
                            {tempSettings.hero.imageRight ? (
                                <>
                                    <img src={tempSettings.hero.imageRight} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative z-10 flex flex-col items-center">
                                         <Edit3 size={16} className="mb-1 text-[#2C2C2C]" />
                                         <p className="text-[8px] uppercase tracking-widest font-bold text-[#2C2C2C]">Change Right</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon size={16} className="mx-auto mb-1 text-[#A09885]" />
                                    <p className="text-[8px] uppercase tracking-widest">Img Right</p>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroRight')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Layout size={14} /> Home Page Sections</h3>
                      <div className="space-y-6">
                        {/* Apparel */}
                        <div className="pb-4 border-b border-[#E5E0D5]">
                           <p className="text-[9px] uppercase font-bold text-[#2C2C2C] mb-3">Apparel Section</p>
                           <div className="grid grid-cols-2 gap-2 mb-2">
                             <input placeholder="Title" value={tempSettings.homeSections.apparelTitle} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, apparelTitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                             <input placeholder="Tag" value={tempSettings.homeSections.apparelTag} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, apparelTag: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                           </div>
                           <input placeholder="Button Text" value={tempSettings.homeSections.apparelButtonText} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, apparelButtonText: e.target.value}})} className="w-full p-2 border border-[#E5E0D5] text-xs outline-none" />
                        </div>
                         {/* Fibre */}
                         <div className="pb-4 border-b border-[#E5E0D5]">
                           <p className="text-[9px] uppercase font-bold text-[#2C2C2C] mb-3">Fibre Section</p>
                           <div className="grid grid-cols-2 gap-2 mb-2">
                             <input placeholder="Title" value={tempSettings.homeSections.fibreTitle} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, fibreTitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                             <input placeholder="Tag" value={tempSettings.homeSections.fibreTag} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, fibreTag: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                           </div>
                           <input placeholder="Button Text" value={tempSettings.homeSections.fibreButtonText} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, fibreButtonText: e.target.value}})} className="w-full p-2 border border-[#E5E0D5] text-xs outline-none" />
                        </div>
                         {/* Visual */}
                         <div className="">
                           <p className="text-[9px] uppercase font-bold text-[#2C2C2C] mb-3">Visual Section</p>
                           <div className="grid grid-cols-2 gap-2 mb-2">
                             <input placeholder="Title" value={tempSettings.homeSections.visualTitle} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, visualTitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                             <input placeholder="Tag" value={tempSettings.homeSections.visualTag} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, visualTag: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                           </div>
                           <input placeholder="Button Text" value={tempSettings.homeSections.visualButtonText} onChange={e => setTempSettings({...tempSettings, homeSections: {...tempSettings.homeSections, visualButtonText: e.target.value}})} className="w-full p-2 border border-[#E5E0D5] text-xs outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer & Cloud */}
                  <div className="space-y-8 md:col-span-2">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                           <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Mail size={14} /> Footer Content</h3>
                           <div className="space-y-4">
                             <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Subscribe Title</label><input value={tempSettings.footer.subscribeTitle} onChange={e => setTempSettings({...tempSettings, footer: { ...tempSettings.footer, subscribeTitle: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                             <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Contact Tag</label><input value={tempSettings.footer.contactTag} onChange={e => setTempSettings({...tempSettings, footer: { ...tempSettings.footer, contactTag: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                                <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Contact Email</label><input value={tempSettings.footer.contactEmail} onChange={e => setTempSettings({...tempSettings, footer: { ...tempSettings.footer, contactEmail: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                             </div>
                           </div>
                        </div>

                        <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Database size={14} /> Cloud Integration</h3>
                          <div className="space-y-4">
                            <input placeholder="Supabase URL" value={tempSettings.integrations?.supabaseUrl || ''} onChange={e => setTempSettings({...tempSettings, integrations: { ...(tempSettings.integrations || { supabaseUrl: '', supabaseAnonKey: '' }), supabaseUrl: e.target.value } })} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" />
                            <input placeholder="Anon Key" type="password" value={tempSettings.integrations?.supabaseAnonKey || ''} onChange={e => setTempSettings({...tempSettings, integrations: { ...(tempSettings.integrations || { supabaseUrl: '', supabaseAnonKey: '' }), supabaseAnonKey: e.target.value } })} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" />
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
                
                <div className="bg-[#F9F7F2] border border-[#E5E0D5] p-8 mb-12 flex justify-between items-center">
                  <h3 className="text-xs uppercase tracking-widest text-[#706C61]">Site Maintenance</h3>
                  <div className="flex gap-4">
                    <button onClick={handleExportBackup} className="px-6 py-3 bg-[#2C2C2C] text-white text-[9px] uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2"><Download size={14}/> Export</button>
                    <label className="px-6 py-3 bg-white border border-[#2C2C2C] text-[#2C2C2C] text-[9px] uppercase tracking-widest hover:bg-[#F9F7F2] cursor-pointer text-center">Import<input type="file" accept=".json" onChange={handleImportBackup} className="hidden" /></label>
                  </div>
                </div>
                <button onClick={() => onUpdateSettings(tempSettings)} className="w-full py-6 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-bold shadow-2xl sticky bottom-6">Confirm All Updates</button>
              </div>
            ) : (activeTab === 'portfolio' || activeTab === 'blog') ? (
              <div className={`grid gap-8 animate-in slide-in-from-right duration-500 ${activeTab === 'portfolio' ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1 md:grid-cols-2'}`}>
                {/* Form Section */}
                <div className={`space-y-6 bg-white border border-[#E5E0D5] p-8 h-fit sticky top-24 shadow-sm ${activeTab === 'portfolio' ? 'xl:col-span-3' : ''}`}>
                  <h3 className="text-sm font-bold uppercase tracking-widest pb-4 border-b text-[#2C2C2C]">
                    {editingId ? `Edit ${activeTab === 'portfolio' ? 'Asset' : 'Post'}` : `New ${activeTab === 'portfolio' ? 'Asset' : 'Post'}`}
                  </h3>
                  <div className="space-y-5">
                    {activeTab === 'portfolio' && (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-[#A09885]">Archive Category</label>
                        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none bg-white">
                          <option value={Category.APPAREL}>Apparel Design</option>
                          <option value={Category.FIBRE}>Fibre Arts</option>
                          <option value={Category.VISUAL}>Visual Arts</option>
                        </select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#A09885]">Title</label>
                      <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Entry Title" className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" />
                    </div>
                    {activeTab === 'blog' ? (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-[#A09885]">Publication Date</label>
                        <input value={newDate} onChange={(e) => setNewDate(e.target.value)} placeholder="October 28, 2024" className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-[#A09885]">Subheading / Tag</label>
                        <input value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} placeholder="Subheading" className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#A09885]">Content Body</label>
                      {activeTab === 'blog' ? (
                        <textarea rows={12} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Write your story here... (Supports basic HTML)" className="w-full p-3 border border-[#E5E0D5] text-xs outline-none resize-none leading-relaxed font-serif" />
                      ) : (
                        <textarea rows={8} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none resize-none leading-relaxed" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#A09885]">Visual Assets</label>
                      <div className="relative border-2 border-dashed border-[#E5E0D5] py-10 text-center hover:bg-[#F9F7F2] transition-colors cursor-pointer group">
                        <ImageIcon size={28} className="mx-auto mb-2 text-[#A09885]" />
                        <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'form')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <p className="text-[8px] uppercase tracking-widest">Upload</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {newImages.map((img, i) => (
                          <div key={i} className="relative w-12 h-12 bg-[#E5E0D5] group rounded-sm overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" />
                            <button onClick={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X size={12}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleSubmit} className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg">
                      {editingId ? 'Save Changes' : 'Publish'}
                    </button>
                    {editingId && <button onClick={resetForm} className="w-full py-2 text-[10px] uppercase tracking-widest text-red-400">Cancel Edit</button>}
                  </div>
                </div>

                {/* Explorer Section */}
                <div className={`space-y-4 ${activeTab === 'portfolio' ? 'xl:col-span-9' : ''}`}>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A09885] mb-6">Archive Explorer</h3>
                  
                  {activeTab === 'portfolio' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[Category.APPAREL, Category.FIBRE, Category.VISUAL].map((cat) => (
                        <div key={cat} className="space-y-4">
                          <h4 className="text-xs uppercase tracking-widest text-[#706C61] border-b border-[#E5E0D5] pb-2 mb-2 font-bold">{cat}</h4>
                          <div className="space-y-3">
                            {portfolio.filter(p => p.category === cat).map((item) => (
                              <div key={item.id} className={`p-3 bg-white border border-[#E5E0D5] flex items-center gap-4 group hover:shadow-md transition-all ${item.pinned ? 'border-l-4 border-l-[#A09885]' : ''}`}>
                                <div className="w-12 h-16 bg-[#F9F7F2] overflow-hidden flex-shrink-0 shadow-sm rounded-sm">
                                  <img src={item.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="serif text-sm truncate mb-1 text-[#2C2C2C]">{item.title}</h4>
                                  <p className="text-[8px] uppercase tracking-widest text-[#A09885] truncate">{item.subtitle}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => onTogglePinItem(item.id)} className={`p-1 transition-all rounded-full hover:bg-[#F9F7F2] ${item.pinned ? 'text-[#A09885]' : 'text-[#E5E0D5] hover:text-[#A09885]'}`}>{item.pinned ? <PinOff size={14} /> : <Pin size={14} />}</button>
                                    <button onClick={() => handleEditPortfolio(item)} className="p-1 text-[#E5E0D5] hover:text-black hover:bg-[#F9F7F2] transition-all rounded-full"><Edit3 size={14} /></button>
                                    <button onClick={() => onDeleteItem(item.id)} className="p-1 text-[#E5E0D5] hover:text-red-500 hover:bg-red-50 transition-all rounded-full"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            ))}
                            {portfolio.filter(p => p.category === cat).length === 0 && (
                                <p className="text-[10px] italic text-[#E5E0D5]">No items in this collection.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blogs.map((item: any) => (
                        <div key={item.id} className={`p-4 bg-white border border-[#E5E0D5] flex items-center gap-6 group hover:shadow-md transition-all ${item.pinned ? 'border-l-4 border-l-[#A09885]' : ''}`}>
                           <div className="w-16 h-20 bg-[#F9F7F2] overflow-hidden flex-shrink-0 shadow-sm rounded-sm">
                             <img src={item.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="serif text-lg truncate mb-1 text-[#2C2C2C]">{item.title}</h4>
                             <p className="text-[9px] uppercase tracking-widest text-[#A09885]">{item.date}</p>
                           </div>
                           <div className="flex gap-1">
                              <button onClick={() => onTogglePinBlog(item.id)} className={`p-2 transition-all rounded-full hover:bg-[#F9F7F2] ${item.pinned ? 'text-[#A09885]' : 'text-[#E5E0D5] hover:text-[#A09885]'}`}>{item.pinned ? <PinOff size={16} /> : <Pin size={16} />}</button>
                              <button onClick={() => handleEditBlog(item)} className="p-2 text-[#E5E0D5] hover:text-black hover:bg-[#F9F7F2] transition-all rounded-full"><Edit3 size={16} /></button>
                              <button onClick={() => onDeleteBlog(item.id)} className="p-2 text-[#E5E0D5] hover:text-red-500 hover:bg-red-50 transition-all rounded-full"><Trash2 size={16} /></button>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'subscribers' ? (
              <div className="bg-white border border-[#E5E0D5] p-12 animate-in fade-in">
                 <div className="text-center mb-12"><Users size={48} className="mx-auto text-[#E5E0D5] mb-4" /><h2 className="text-2xl serif italic">Audience Registry</h2></div>
                 <div className="max-w-2xl mx-auto divide-y divide-[#E5E0D5]">
                   {subscribers.map(sub => (
                     <div key={sub.id} className="py-6 flex justify-between items-center group">
                       <div><p className="text-sm serif">{sub.email}</p><p className="text-[8px] uppercase tracking-widest text-[#A09885] mt-1">Joined {new Date(sub.date).toLocaleDateString()}</p></div>
                       <button onClick={() => onDeleteSubscriber(sub.id)} className="text-red-300 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500"><Trash2 size={16}/></button>
                     </div>
                   ))}
                 </div>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E0D5] p-12 max-w-lg mx-auto text-center">
                 <ShieldCheck size={48} className="mx-auto text-[#E5E0D5] mb-8" /><h2 className="text-2xl serif mb-8">Access Key</h2>
                 <div className="space-y-4">
                   <input type="password" placeholder="Current Secret" value={pwdCurrent} onChange={e => setPwdCurrent(e.target.value)} className="w-full p-4 border text-xs outline-none" />
                   <input type="password" placeholder="New Secret" value={pwdNew} onChange={e => setPwdNew(e.target.value)} className="w-full p-4 border text-xs outline-none" />
                   <input type="password" placeholder="Confirm New Secret" value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)} className="w-full p-4 border text-xs outline-none" />
                   <button onClick={() => {
                      if (pwdNew !== pwdConfirm) { alert("Secrets do not match."); return; }
                      if (onUpdatePassword(pwdCurrent, pwdNew)) { alert("Synced successfully."); setPwdCurrent(''); setPwdNew(''); setPwdConfirm(''); } else { alert("Invalid current secret."); }
                    }} className="w-full py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold">Update Dashboard Access</button>
                 </div>
              </div>
            )}
        </div>
      </div>
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
  const [toastMessage, setToastMessage] = useState('');

  // Local Storage Persistence
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
    
    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) setBlogs(JSON.parse(savedBlogs));
    
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) setSiteSettings(JSON.parse(savedSettings));

    const savedSubs = localStorage.getItem('subscribers');
    if (savedSubs) setSubscribers(JSON.parse(savedSubs));
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    localStorage.setItem('blogs', JSON.stringify(blogs));
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
  }, [portfolio, blogs, siteSettings, subscribers]);

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

  const showToast = (msg: string) => setToastMessage(msg);

  const handleLogin = (password: string) => {
    if (password === K) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => setIsAdmin(false);

  const handleSubscribe = (email: string) => {
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
    showToast("Thank you for subscribing.");
  };

  const handleAddItem = (item: PortfolioItem) => {
    setPortfolio([item, ...portfolio]);
    showToast("Asset added.");
  };

  const handleAddBlog = (blog: BlogPost) => {
    setBlogs([blog, ...blogs]);
    showToast("Entry published.");
  };

  const handleDeleteItem = (id: string) => {
    setPortfolio(portfolio.filter(i => i.id !== id));
    showToast("Asset removed.");
  };

  const handleDeleteBlog = (id: string) => {
    setBlogs(blogs.filter(b => b.id !== id));
    showToast("Entry deleted.");
  };

  const handleUpdateItem = (id: string, updated: PortfolioItem) => {
    setPortfolio(portfolio.map(i => i.id === id ? updated : i));
    showToast("Asset updated.");
  };

  const handleUpdateBlog = (id: string, updated: BlogPost) => {
    setBlogs(blogs.map(b => b.id === id ? updated : b));
    showToast("Entry updated.");
  };

  const handleTogglePinItem = (id: string) => {
    setPortfolio(portfolio.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i));
  };

  const handleTogglePinBlog = (id: string) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b));
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers(subscribers.filter(s => s.id !== id));
    showToast("Subscriber removed.");
  };

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    showToast("Configuration saved.");
  };

  const handleUpdatePassword = (old: string, updated: string) => {
    if (old === K) {
      showToast("Password updated (Simulated).");
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

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F9F7F2] text-[#2C2C2C] selection:bg-[#E5E0D5] selection:text-[#2C2C2C] font-sans">
        <Navbar settings={siteSettings.navbar} />
        
        <Routes>
          <Route path="/" element={<HomePage portfolio={sortedPortfolio} blogs={sortedBlogs} siteSettings={siteSettings} onItemClick={setSelectedItem} onBlogClick={setSelectedBlog} />} />
          <Route path="/apparel" element={<CategoryPage category={Category.APPAREL} items={sortedPortfolio} onItemClick={setSelectedItem} />} />
          <Route path="/fibre" element={<CategoryPage category={Category.FIBRE} items={sortedPortfolio} onItemClick={setSelectedItem} />} />
          <Route path="/visual" element={<CategoryPage category={Category.VISUAL} items={sortedPortfolio} onItemClick={setSelectedItem} />} />
          <Route path="/journal" element={<JournalPage blogs={sortedBlogs} onBlogClick={setSelectedBlog} />} />
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
        
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
      </div>
    </Router>
  );
};

export default App;

const CategoryPage: React.FC<{ category: Category; items: PortfolioItem[]; onItemClick: (item: PortfolioItem) => void }> = ({ category, items, onItemClick }) => {
  const filteredItems = items.filter(item => item.category === category);
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"><p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{category}</p><h2 className="text-5xl serif italic">Collections</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">{filteredItems.map((item) => (<div key={item.id} className="cursor-pointer group flex flex-col" onClick={() => onItemClick(item)}><div className="aspect-[9/16] overflow-hidden mb-6 bg-[#E5E0D5] relative shadow-sm"><img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div><p className="text-[10px] uppercase tracking-widest text-[#706C61] mb-2">{item.subtitle}</p><h3 className="text-xl serif mb-2 group-hover:italic transition-all">{item.title}</h3></div>))}</div>
      </div>
    </div>
  );
};

const JournalPage: React.FC<{ blogs: BlogPost[]; onBlogClick: (blog: BlogPost) => void }> = ({ blogs, onBlogClick }) => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-[#F9F7F2] animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"><p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">The Archive</p><h2 className="text-5xl serif italic">Journal</h2></div>
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
             <div className="w-8 h-[1px] bg-[#E5E0D5]"></div>
             <p className="text-xs uppercase tracking-[0.2em] text-[#706C61] italic">By {post.author}</p>
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
