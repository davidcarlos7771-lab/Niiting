
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import JournalCard from './components/JournalCard';
import AdminLogin from './components/AdminLogin';
import PortfolioGallery from './components/PortfolioGallery';
import { Category, PortfolioItem, BlogPost, SiteSettings } from './types';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS, INITIAL_SETTINGS, K } from './constants';
import { Plus, Trash2, Camera, LogOut, Image as ImageIcon, X, Edit3, ChevronLeft, ChevronRight, Mail, Users, CheckCircle2, Settings, Globe, ShieldCheck, Pin, PinOff, Download, Upload, Database, Info, Layout, Share2, Type, AlertCircle, FileArchive, CheckCircle } from 'lucide-react';

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
  onUpdateSubscriber: (id: string, email: string) => void,
  onUpdateSettings: (settings: SiteSettings) => void,
  onUpdatePassword: (old: string, updated: string) => boolean,
  onImportData: (data: any) => void
}> = ({ 
  portfolio, blogs, subscribers, siteSettings, onLogout, 
  onAddItem, onAddBlog, onDeleteItem, onDeleteBlog, onUpdateItem, onUpdateBlog, onTogglePinItem, onTogglePinBlog,
  onDeleteSubscriber, onUpdateSubscriber, onUpdateSettings, onUpdatePassword, onImportData
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
  const [newAuthor, setNewAuthor] = useState('');
  const [tempSettings, setTempSettings] = useState<SiteSettings>(siteSettings);

  useEffect(() => {
    if (!editingId) {
      setNewDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      setNewAuthor('Elena');
    }
  }, [activeTab, editingId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'form' | 'heroLeft' | 'heroRight' | 'favicon') => {
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
        } else if (target === 'favicon') {
          setTempSettings({ ...tempSettings, faviconUrl: result });
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleExportBackup = () => {
    const backupData = { portfolio, blogs, subscribers, siteSettings, version: "7.4", exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artisanal_site_backup_${new Date().toISOString().split('T')[0]}.json`;
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
          if (data.portfolio && data.blogs && data.siteSettings) {
            onImportData(data);
            alert("Success: Site state restored!");
          } else { alert("Error: Invalid backup file."); }
        } catch (err) { alert("Error: Could not parse JSON."); }
      };
      reader.readAsText(file);
    }
  };

  const resetForm = () => {
    setNewTitle(''); setNewSubtitle(''); setNewDesc(''); setNewImages([]); setEditingId(null);
    setNewDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setActiveTab('portfolio'); setEditingId(item.id); setNewTitle(item.title);
    setNewSubtitle(item.subtitle || ''); setNewDesc(item.description);
    setNewCategory(item.category); setNewImages(item.imageUrls);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditBlog = (blog: BlogPost) => {
    setActiveTab('blog'); setEditingId(blog.id); setNewTitle(blog.title);
    setNewDesc(blog.content); setNewImages(blog.imageUrls); setNewDate(blog.date);
    setNewAuthor(blog.author); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newTitle || newImages.length === 0) { alert("Title and image are required."); return; }
    if (activeTab === 'portfolio') {
      const item: PortfolioItem = { id: editingId || Math.random().toString(36).substr(2, 9), title: newTitle, subtitle: newSubtitle, description: newDesc, category: newCategory, imageUrls: newImages, createdAt: Date.now() };
      if (editingId) onUpdateItem(editingId, item); else onAddItem(item);
    } else {
      const blog: BlogPost = { id: editingId || Math.random().toString(36).substr(2, 9), title: newTitle, date: newDate, content: newDesc, imageUrls: newImages, author: newAuthor };
      if (editingId) onUpdateBlog(editingId, blog); else onAddBlog(blog);
    }
    resetForm();
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 min-h-screen animate-in fade-in">
      <div className="flex justify-between items-center mb-12 pb-6 border-b border-[#E5E0D5]">
        <h1 className="text-4xl serif tracking-tight">Studio Archive</h1>
        <button onClick={onLogout} className="flex items-center text-xs uppercase tracking-widest text-[#706C61] hover:text-black transition-colors">
          <LogOut size={16} className="mr-2" /> End Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <button onClick={() => setActiveTab('portfolio')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'portfolio' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><ImageIcon size={14}/> Gallery Assets</button>
          <button onClick={() => setActiveTab('blog')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'blog' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><Edit3 size={14}/> Journal Logs</button>
          <button onClick={() => setActiveTab('subscribers')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'subscribers' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><Users size={14}/> Subscribers</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><Settings size={14}/> Site Config</button>
          <button onClick={() => setActiveTab('security')} className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === 'security' ? 'bg-[#2C2C2C] text-white shadow-lg' : 'bg-white border border-[#E5E0D5] text-[#706C61] hover:bg-[#F9F7F2]'}`}><ShieldCheck size={14}/> Access Key</button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'settings' ? (
            <div className="animate-in slide-in-from-right duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-8">
                  <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Globe size={14} /> Browser Presence</h3>
                    <div className="space-y-6">
                      <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Tab Title</label><input value={tempSettings.tabTitle} onChange={e => setTempSettings({...tempSettings, tabTitle: e.target.value })} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" placeholder="e.g. Elena's Portfolio" /></div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Favicon URL</label>
                        <input value={tempSettings.faviconUrl} onChange={e => setTempSettings({...tempSettings, faviconUrl: e.target.value })} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" placeholder="https://..." />
                        <div className="mt-4">
                          <div className="relative border border-dashed border-[#E5E0D5] p-6 text-center hover:bg-[#F9F7F2] transition-colors cursor-pointer group">
                            <ImageIcon size={20} className="mx-auto mb-2 text-[#A09885] group-hover:scale-110 transition-transform" />
                            <p className="text-[9px] uppercase tracking-widest text-[#706C61]">Upload Favicon File</p>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'favicon')} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                          {tempSettings.faviconUrl && (
                            <div className="mt-3 flex items-center gap-3 p-2 bg-[#F9F7F2] rounded">
                              <img src={tempSettings.faviconUrl} className="w-8 h-8 object-contain" alt="Favicon Preview" />
                              <span className="text-[9px] uppercase tracking-widest text-[#A09885]">Current Icon Preview</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b">Branding</h3>
                    <div className="space-y-6">
                      <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Site Logo</label><input value={tempSettings.navbar.logo} onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, logo: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                      <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Logo Subtitle</label><input value={tempSettings.navbar.subtitle} onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, subtitle: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b">Nav Labels</h3>
                    <div className="space-y-6">
                      {Object.keys(tempSettings.navbar.links).map((key) => (
                        <div key={key} className="flex items-center gap-4">
                          <label className="w-24 text-[9px] uppercase tracking-widest text-[#A09885]">{key}</label>
                          <input 
                            value={(tempSettings.navbar.links as any)[key]} 
                            onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, links: { ...tempSettings.navbar.links, [key]: e.target.value } }})} 
                            className="flex-1 p-2 border border-[#E5E0D5] text-[10px] outline-none" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b">Connect Icons</h3>
                    <div className="space-y-4">
                      {['instagram', 'facebook', 'youtube'].map((platform) => (
                        <div key={platform} className="flex items-center gap-4">
                          <Share2 size={12} className="text-[#A09885]" />
                          <input 
                            placeholder={`${platform} URL`} 
                            value={(tempSettings.navbar.socials as any)[platform]} 
                            onChange={e => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, socials: { ...tempSettings.navbar.socials, [platform]: e.target.value } }})} 
                            className="flex-1 p-2 border border-[#E5E0D5] text-[10px] outline-none" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b">Hero Section</h3>
                    <div className="space-y-6">
                      <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Hero Tag</label><input value={tempSettings.hero.tag} onChange={e => setTempSettings({...tempSettings, hero: { ...tempSettings.hero, tag: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                      <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Hero Title</label><input value={tempSettings.hero.title} onChange={e => setTempSettings({...tempSettings, hero: { ...tempSettings.hero, title: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                      <div><label className="text-[9px] uppercase tracking-widest text-[#A09885] mb-2 block">Description</label><textarea rows={3} value={tempSettings.hero.description} onChange={e => setTempSettings({...tempSettings, hero: { ...tempSettings.hero, description: e.target.value }})} className="w-full p-3 border border-[#E5E0D5] text-xs outline-none" /></div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b">Home Sections</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['apparelTag', 'apparelTitle', 'apparelButtonText', 'fibreTag', 'fibreTitle', 'fibreButtonText', 'visualTag', 'visualTitle', 'visualButtonText', 'archiveTag', 'archiveTitle'].map((key) => (
                        <div key={key}>
                          <label className="text-[8px] uppercase tracking-tighter text-[#A09885] mb-1 block">{key}</label>
                          <input 
                            value={(tempSettings.homeSections as any)[key]} 
                            onChange={e => setTempSettings({...tempSettings, homeSections: { ...tempSettings.homeSections, [key]: e.target.value } })} 
                            className="w-full p-2 border border-[#E5E0D5] text-[10px] outline-none" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b">Footer</h3>
                    <div className="space-y-4">
                      <input value={tempSettings.footer.subscribeTitle} onChange={e => setTempSettings({...tempSettings, footer: { ...tempSettings.footer, subscribeTitle: e.target.value }})} className="w-full p-2 border border-[#E5E0D5] text-[10px] outline-none" />
                      <input value={tempSettings.footer.contactTag} onChange={e => setTempSettings({...tempSettings, footer: { ...tempSettings.footer, contactTag: e.target.value }})} className="w-full p-2 border border-[#E5E0D5] text-[10px] outline-none" />
                      <input value={tempSettings.footer.contactEmail} onChange={e => setTempSettings({...tempSettings, footer: { ...tempSettings.footer, contactEmail: e.target.value }})} className="w-full p-2 border border-[#E5E0D5] text-[10px] outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hostinger Checklist Section */}
              <div className="bg-[#F9F7F2] border border-amber-200 p-8 flex flex-col gap-10 mb-12">
                <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                  <div className="flex-1">
                     <h3 className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest mb-6"><CheckCircle size={18}/> Hostinger Deployment Checklist</h3>
                     <div className="space-y-4">
                       <div className="flex gap-4 p-4 bg-white border border-amber-100">
                         <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                         <p className="text-[10px] text-amber-800 leading-relaxed uppercase">
                           <strong>No Folders:</strong> Select all files in the root folder (index.html, package.json, App.tsx, etc.) and zip them directly. Do not zip the parent folder.
                         </p>
                       </div>
                       <div className="flex gap-4 p-4 bg-white border border-amber-100">
                         <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                         <p className="text-[10px] text-amber-800 leading-relaxed uppercase">
                           <strong>Build Command:</strong> If prompted by Hostinger, use <code className="bg-amber-50 px-1">npm install</code> and <code className="bg-amber-50 px-1">npm run build</code>.
                         </p>
                       </div>
                       <div className="flex gap-4 p-4 bg-white border border-amber-100">
                         <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                         <p className="text-[10px] text-amber-800 leading-relaxed uppercase">
                           <strong>Root Files:</strong> Ensure <code className="bg-amber-50 px-1">package.json</code> is visible the moment you open the zip archive.
                         </p>
                       </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button onClick={handleExportBackup} className="px-10 py-5 bg-amber-800 text-white text-[10px] uppercase tracking-widest hover:bg-amber-900 transition-colors shadow-md flex items-center justify-center gap-2"><Download size={14}/> Download Backup</button>
                    <label className="px-10 py-5 bg-white border border-amber-800 text-amber-800 text-[10px] uppercase tracking-widest hover:bg-amber-50 cursor-pointer transition-colors shadow-sm text-center">
                      Restore Backup
                      <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <button onClick={() => onUpdateSettings(tempSettings)} className="w-full py-6 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-bold hover:opacity-90 transition-opacity sticky bottom-6 shadow-2xl">Publish All Changes</button>
            </div>
          ) : activeTab === 'portfolio' || activeTab === 'blog' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6 bg-white border border-[#E5E0D5] p-8 h-fit sticky top-24">
                  <h3 className="text-sm font-bold uppercase tracking-widest pb-4 border-b">{editingId ? 'Modify Entry' : 'Create Entry'}</h3>
                  <div className="space-y-4">
                    {activeTab === 'portfolio' && (
                      <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)} className="w-full p-4 border text-xs outline-none bg-white">
                        <option value={Category.APPAREL}>Apparel Design</option>
                        <option value={Category.FIBRE}>Fibre Arts</option>
                        <option value={Category.VISUAL}>Visual Arts</option>
                      </select>
                    )}
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Main Title" className="w-full p-4 border text-xs outline-none" />
                    <input value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} placeholder="Sub Heading (Optional)" className="w-full p-4 border text-xs outline-none" />
                    <textarea rows={6} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Detailed Description..." className="w-full p-4 border text-xs outline-none resize-none leading-relaxed" />
                    <div className="relative border-2 border-dashed border-[#E5E0D5] py-12 text-center hover:bg-[#F9F7F2] transition-colors cursor-pointer group">
                      <ImageIcon size={32} className="mx-auto mb-2 text-[#A09885] group-hover:scale-110 transition-transform" />
                      <p className="text-[9px] uppercase tracking-widest text-[#706C61]">Drag or Drop Assets</p>
                      <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'form')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    {newImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {newImages.map((img, i) => (
                          <div key={i} className="relative w-12 h-12 bg-[#E5E0D5] overflow-hidden group">
                            <img src={img} className="w-full h-full object-cover" />
                            <button onClick={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X size={12}/></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={handleSubmit} className="w-full py-5 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold">{editingId ? 'Update Entry' : 'Add to Archive'}</button>
                    {editingId && <button onClick={resetForm} className="w-full text-[10px] uppercase tracking-widest text-red-400">Cancel Editing</button>}
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-[#A09885] mb-6">Archive Explorer</h3>
                  {(activeTab === 'portfolio' ? portfolio : blogs).map((item: any) => (
                    <div key={item.id} className={`p-4 bg-white border border-[#E5E0D5] flex items-center gap-6 group hover:shadow-md transition-all ${item.pinned ? 'border-l-4 border-l-[#A09885]' : ''}`}>
                       <div className="w-16 h-20 bg-[#F9F7F2] overflow-hidden flex-shrink-0 shadow-sm"><img src={item.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                       <div className="flex-1 min-w-0">
                         <h4 className="serif text-lg truncate mb-1">{item.title}</h4>
                         <p className="text-[9px] uppercase tracking-widest text-[#A09885]">{activeTab === 'portfolio' ? item.category : item.date}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => activeTab === 'portfolio' ? onTogglePinItem(item.id) : onTogglePinBlog(item.id)} className={`p-2 transition-colors ${item.pinned ? 'text-[#A09885]' : 'text-[#E5E0D5] hover:text-[#A09885]'}`}>{item.pinned ? <PinOff size={16}/> : <Pin size={16}/>}</button>
                          <button onClick={() => activeTab === 'portfolio' ? handleEditPortfolio(item) : handleEditBlog(item)} className="p-2 text-[#E5E0D5] hover:text-black transition-colors"><Edit3 size={16}/></button>
                          <button onClick={() => activeTab === 'portfolio' ? onDeleteItem(item.id) : onDeleteBlog(item.id)} className="p-2 text-[#E5E0D5] hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : activeTab === 'subscribers' ? (
            <div className="bg-white border border-[#E5E0D5] p-12 animate-in fade-in">
               <div className="text-center mb-12">
                 <Users size={48} className="mx-auto text-[#E5E0D5] mb-4" />
                 <h2 className="text-2xl serif italic">Audience Ledger</h2>
                 <p className="text-[10px] uppercase tracking-widest text-[#A09885] mt-2">Recently Subscribed members</p>
               </div>
               <div className="max-w-2xl mx-auto divide-y divide-[#E5E0D5]">
                 {subscribers.map(sub => (
                   <div key={sub.id} className="py-6 flex justify-between items-center group">
                     <div><p className="text-sm serif">{sub.email}</p><p className="text-[8px] uppercase tracking-widest text-[#A09885] mt-1">Added on {new Date(sub.date).toLocaleDateString()}</p></div>
                     <button onClick={() => onDeleteSubscriber(sub.id)} className="text-red-300 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500"><Trash2 size={16}/></button>
                   </div>
                 ))}
                 {subscribers.length === 0 && <p className="py-12 text-center text-[10px] uppercase tracking-widest text-[#A09885] italic">No active records found.</p>}
               </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E0D5] p-12 max-w-lg mx-auto text-center">
               <ShieldCheck size={48} className="mx-auto text-[#E5E0D5] mb-8" />
               <h2 className="text-2xl serif mb-8">Access Verification</h2>
               <div className="space-y-4">
                 <input type="password" placeholder="Current Secret Key" value={pwdCurrent} onChange={e => setPwdCurrent(e.target.value)} className="w-full p-4 border text-xs outline-none" />
                 <input type="password" placeholder="New Secret Key" value={pwdNew} onChange={e => setPwdNew(e.target.value)} className="w-full p-4 border text-xs outline-none" />
                 <input type="password" placeholder="Confirm New Key" value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)} className="w-full p-4 border text-xs outline-none" />
                 <button 
                  onClick={() => {
                    if (pwdNew !== pwdConfirm) { alert("New keys do not match."); return; }
                    if (onUpdatePassword(pwdCurrent, pwdNew)) { alert("Security key synchronized."); setPwdCurrent(''); setPwdNew(''); setPwdConfirm(''); } else { alert("Current key invalid."); }
                  }} 
                  className="w-full py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold"
                 >Sync New Credentials</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try { const saved = localStorage.getItem('elena_portfolio_v7'); return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO; } catch (e) { return INITIAL_PORTFOLIO; }
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try { const saved = localStorage.getItem('elena_blogs_v7'); return saved ? JSON.parse(saved) : INITIAL_BLOGS; } catch (e) { return INITIAL_BLOGS; }
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try { const saved = localStorage.getItem('elena_subscribers_v7'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try { const saved = localStorage.getItem('elena_settings_v7'); return saved ? JSON.parse(saved) : INITIAL_SETTINGS; } catch (e) { return INITIAL_SETTINGS; }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('elena_auth') === 'true');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('elena_portfolio_v7', JSON.stringify(portfolio));
    localStorage.setItem('elena_blogs_v7', JSON.stringify(blogs));
    localStorage.setItem('elena_subscribers_v7', JSON.stringify(subscribers));
    localStorage.setItem('elena_settings_v7', JSON.stringify(siteSettings));
  }, [portfolio, blogs, subscribers, siteSettings]);

  useEffect(() => {
    if (siteSettings.tabTitle) document.title = siteSettings.tabTitle;
    if (siteSettings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.getElementsByTagName('head')[0].appendChild(link); }
      link.href = siteSettings.faviconUrl;
    }
  }, [siteSettings.tabTitle, siteSettings.faviconUrl]);

  const handleImportData = (data: any) => {
    setPortfolio(data.portfolio); setBlogs(data.blogs);
    setSubscribers(data.subscribers || []); setSiteSettings(data.siteSettings);
    setToastMessage("Vault state restored");
  };

  const handleAdminLogin = (passwordAttempt: string) => {
    const key = localStorage.getItem('elena_admin_secret') || K;
    if (passwordAttempt === key) { setIsLoggedIn(true); localStorage.setItem('elena_auth', 'true'); return true; }
    return false;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-[#E5E0D5]">
        <Navbar settings={siteSettings.navbar} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage portfolio={portfolio} blogs={blogs} siteSettings={siteSettings} onItemClick={setSelectedProject} onBlogClick={setSelectedBlog} />} />
            <Route path="/journal" element={<JournalPage blogs={blogs} onBlogClick={setSelectedBlog} />} />
            <Route path="/studio" element={
              isLoggedIn ? (
                <AdminDashboard 
                  portfolio={portfolio} blogs={blogs} subscribers={subscribers} siteSettings={siteSettings}
                  onLogout={() => { setIsLoggedIn(false); localStorage.removeItem('elena_auth'); }}
                  onAddItem={(item) => setPortfolio([item, ...portfolio])}
                  onAddBlog={(blog) => setBlogs([blog, ...blogs])}
                  onDeleteItem={(id) => setPortfolio(portfolio.filter(p => p.id !== id))}
                  onDeleteBlog={(id) => setBlogs(blogs.filter(b => b.id !== id))}
                  onUpdateItem={(id, updated) => setPortfolio(portfolio.map(p => p.id === id ? updated : p))}
                  onUpdateBlog={(id, updated) => setBlogs(blogs.map(b => b.id === id ? updated : b))}
                  onTogglePinItem={(id) => setPortfolio(portfolio.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p))}
                  onTogglePinBlog={(id) => setBlogs(blogs.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b))}
                  onDeleteSubscriber={(id) => setSubscribers(subscribers.filter(s => s.id !== id))}
                  onUpdateSubscriber={(id, email) => setSubscribers(subscribers.map(s => s.id === id ? { ...s, email } : s))}
                  onUpdateSettings={setSiteSettings}
                  onUpdatePassword={(old, updated) => {
                    const key = localStorage.getItem('elena_admin_secret') || K;
                    if (old === key) { localStorage.setItem('elena_admin_secret', updated); return true; }
                    return false;
                  }}
                  onImportData={handleImportData}
                />
              ) : ( <AdminLogin onLogin={handleAdminLogin} /> )
            } />
            <Route path="/apparel" element={<CategoryPage category={Category.APPAREL} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/fibre" element={<CategoryPage category={Category.FIBRE} items={portfolio} onItemClick={setSelectedProject} />} />
            <Route path="/visual" element={<CategoryPage category={Category.VISUAL} items={portfolio} onItemClick={setSelectedProject} />} />
          </Routes>
        </div>
        <Footer onSubscribe={(email) => setSubscribers([{id: Math.random().toString(), email, date: new Date().toISOString()}, ...subscribers])} settings={siteSettings.footer} />
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        <PortfolioGallery item={selectedProject} onClose={() => setSelectedProject(null)} />
        <BlogDetail post={selectedBlog} onClose={() => setSelectedBlog(null)} />
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
    <div className="pt-32 pb-24 px-6 md:px-12 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto"><div className="text-center mb-16"><p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">The Archive</p><h2 className="text-5xl serif italic">Journal</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">{blogs.map((post) => (<JournalCard key={post.id} post={post} onClick={onBlogClick} />))}</div>
      </div>
    </div>
  );
};

const BlogDetail: React.FC<{ post: BlogPost | null; onClose: () => void }> = ({ post, onClose }) => {
  if (!post) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-[#F9F7F2] overflow-y-auto animate-in slide-in-from-bottom duration-500" onClick={onClose}>
      <button onClick={onClose} className="fixed top-8 right-8 p-2 text-[#2C2C2C] z-[110]"><X size={32} strokeWidth={1} /></button>
      <div className="max-w-4xl mx-auto px-6 py-24" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-12"><p className="text-xs uppercase tracking-widest text-[#706C61] mb-4">{post.date}</p><h1 className="text-4xl md:text-6xl serif mb-8 leading-tight">{post.title}</h1><div className="w-12 h-[1px] bg-[#2C2C2C] mx-auto"></div></div>
        <div className="space-y-12">{post.imageUrls.map((url, idx) => (<div key={idx} className="aspect-[16/9] overflow-hidden bg-[#E5E0D5] shadow-lg"><img src={url} className="w-full h-full object-cover" /></div>))}
        <div className="prose prose-stone mx-auto"><p className="text-lg md:text-xl leading-relaxed text-[#2C2C2C] whitespace-pre-wrap">{post.content}</p></div></div>
      </div>
    </div>
  );
};

const HomePage: React.FC<{ portfolio: PortfolioItem[], blogs: BlogPost[], siteSettings: SiteSettings, onItemClick: (item: PortfolioItem) => void, onBlogClick: (blog: BlogPost) => void }> = ({ portfolio, blogs, siteSettings, onItemClick, onBlogClick }) => {
  return (
    <div className="animate-in fade-in duration-700">
      <Hero settings={siteSettings.hero} />
      <CategorySection category={Category.APPAREL} items={portfolio} link="/apparel" onItemClick={onItemClick} customTitle={siteSettings.homeSections.apparelTitle} customTag={siteSettings.homeSections.apparelTag} buttonText={siteSettings.homeSections.apparelButtonText} />
      <CategorySection category={Category.FIBRE} items={portfolio} link="/fibre" onItemClick={onItemClick} customTitle={siteSettings.homeSections.fibreTitle} customTag={siteSettings.homeSections.fibreTag} buttonText={siteSettings.homeSections.fibreButtonText} />
      <CategorySection category={Category.VISUAL} items={portfolio} link="/visual" onItemClick={onItemClick} customTitle={siteSettings.homeSections.visualTitle} customTag={siteSettings.homeSections.visualTag} buttonText={siteSettings.homeSections.visualButtonText} />
      <section className="py-24 px-4 md:px-12 bg-[#F9F7F2]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16"><p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{siteSettings.homeSections.archiveTag}</p><h2 className="text-4xl serif italic">{siteSettings.homeSections.archiveTitle}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{blogs.slice(0, 4).map(post => (<JournalCard key={post.id} post={post} onClick={onBlogClick} />))}</div>
        </div>
      </section>
    </div>
  );
};
