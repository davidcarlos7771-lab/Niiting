
import React, { useState, useEffect } from 'react';
import { Trash2, LogOut, Image as ImageIcon, X, Edit3, Users, Settings, Globe, ShieldCheck, Pin, PinOff, Download, Database, Mail, Share2, Layout, Map } from 'lucide-react';
import { Category, PortfolioItem, BlogPost, SiteSettings, Subscriber } from '../types';
import { INITIAL_SETTINGS } from '../constants';

interface AdminDashboardProps {
  portfolio: PortfolioItem[];
  blogs: BlogPost[];
  subscribers: Subscriber[];
  siteSettings: SiteSettings;
  onLogout: () => void;
  onAddItem: (item: PortfolioItem) => void;
  onAddBlog: (blog: BlogPost) => void;
  onDeleteItem: (id: string) => void;
  onDeleteBlog: (id: string) => void;
  onUpdateItem: (id: string, item: PortfolioItem) => void;
  onUpdateBlog: (id: string, blog: BlogPost) => void;
  onTogglePinItem: (id: string) => void;
  onTogglePinBlog: (id: string) => void;
  onDeleteSubscriber: (id: string) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdatePassword: (old: string, updated: string) => boolean;
  onImportData: (data: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
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

  // Initial sync with props
  useEffect(() => {
    // Ensure we have defaults if new fields were added
    setTempSettings({
        ...siteSettings,
        pageHeaders: siteSettings.pageHeaders || INITIAL_SETTINGS.pageHeaders
    });
  }, [siteSettings]);

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
                               <div className="w-12 h-12 bg-[#F9F7F2] border border-[#E5E0D5] p-2 flex items-center justify-center shrink-0 relative group">
                                 <img src={tempSettings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                                 <button onClick={() => setTempSettings({...tempSettings, faviconUrl: ''})} className="absolute -top-2 -right-2 z-30 bg-red-400 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"><X size={10} /></button>
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
                               <div className="w-12 h-12 bg-[#F9F7F2] border border-[#E5E0D5] p-2 flex items-center justify-center shrink-0 relative group">
                                 <img src={tempSettings.navbar.logoImage} alt="Logo" className="w-full h-full object-contain" />
                                 <button onClick={() => setTempSettings({...tempSettings, navbar: { ...tempSettings.navbar, logoImage: '' }})} className="absolute -top-2 -right-2 z-30 bg-red-400 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"><X size={10} /></button>
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

                  {/* Navigation & Headers (New) */}
                  <div className="space-y-8">
                    <div className="bg-white border border-[#E5E0D5] p-8 shadow-sm">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Map size={14} /> Navigation & Headers</h3>
                      <div className="space-y-6">
                        {/* Navbar Links */}
                        <div className="pb-4 border-b border-[#E5E0D5]">
                            <p className="text-[9px] uppercase font-bold text-[#2C2C2C] mb-3">Navbar Menu Items</p>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <input placeholder="Home Link" value={tempSettings.navbar.links.home} onChange={e => setTempSettings({...tempSettings, navbar: {...tempSettings.navbar, links: {...tempSettings.navbar.links, home: e.target.value}}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                <input placeholder="Apparel Link" value={tempSettings.navbar.links.apparel} onChange={e => setTempSettings({...tempSettings, navbar: {...tempSettings.navbar, links: {...tempSettings.navbar.links, apparel: e.target.value}}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                <input placeholder="Fibre Link" value={tempSettings.navbar.links.fibre} onChange={e => setTempSettings({...tempSettings, navbar: {...tempSettings.navbar, links: {...tempSettings.navbar.links, fibre: e.target.value}}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                <input placeholder="Visual Link" value={tempSettings.navbar.links.visual} onChange={e => setTempSettings({...tempSettings, navbar: {...tempSettings.navbar, links: {...tempSettings.navbar.links, visual: e.target.value}}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                <input placeholder="Journal Link" value={tempSettings.navbar.links.journal} onChange={e => setTempSettings({...tempSettings, navbar: {...tempSettings.navbar, links: {...tempSettings.navbar.links, journal: e.target.value}}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                            </div>
                        </div>
                        {/* Page Headers */}
                        <div>
                            <p className="text-[9px] uppercase font-bold text-[#2C2C2C] mb-3">Sub-Page Headers</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[8px] uppercase tracking-widest text-[#A09885] block mb-1">Apparel Page</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input placeholder="Title" value={tempSettings.pageHeaders?.apparelTitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, apparelTitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                        <input placeholder="Subtitle" value={tempSettings.pageHeaders?.apparelSubtitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, apparelSubtitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[8px] uppercase tracking-widest text-[#A09885] block mb-1">Fibre Page</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input placeholder="Title" value={tempSettings.pageHeaders?.fibreTitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, fibreTitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                        <input placeholder="Subtitle" value={tempSettings.pageHeaders?.fibreSubtitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, fibreSubtitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[8px] uppercase tracking-widest text-[#A09885] block mb-1">Visual Page</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input placeholder="Title" value={tempSettings.pageHeaders?.visualTitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, visualTitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                        <input placeholder="Subtitle" value={tempSettings.pageHeaders?.visualSubtitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, visualSubtitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[8px] uppercase tracking-widest text-[#A09885] block mb-1">Journal Page</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input placeholder="Title" value={tempSettings.pageHeaders?.journalTitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, journalTitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                        <input placeholder="Subtitle" value={tempSettings.pageHeaders?.journalSubtitle} onChange={e => setTempSettings({...tempSettings, pageHeaders: {...tempSettings.pageHeaders, journalSubtitle: e.target.value}})} className="p-2 border border-[#E5E0D5] text-xs outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>

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
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTempSettings({...tempSettings, hero: {...tempSettings.hero, imageLeft: ''}}); }} className="absolute top-2 right-2 bg-white/80 text-red-500 p-2 rounded-full z-30 hover:bg-white transition-colors shadow-sm cursor-pointer"><Trash2 size={14} /></button>
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
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTempSettings({...tempSettings, hero: {...tempSettings.hero, imageRight: ''}}); }} className="absolute top-2 right-2 bg-white/80 text-red-500 p-2 rounded-full z-30 hover:bg-white transition-colors shadow-sm cursor-pointer"><Trash2 size={14} /></button>
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
                          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#706C61] mb-8 pb-4 border-b flex items-center gap-2"><Database size={14} /> Cloud Integration (Admin Only)</h3>
                          <div className="space-y-4">
                            <p className="text-[9px] text-red-400 leading-relaxed italic">
                              Note: To make the site visible to public visitors, you must also paste these keys into your <code>constants.ts</code> file before deploying.
                            </p>
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
                    <button onClick={handleExportBackup} className="px-6 py-3 bg-[#2C2C2C] text-white text-[9px] uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2 cursor-pointer"><Download size={14}/> Export</button>
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

export default AdminDashboard;
