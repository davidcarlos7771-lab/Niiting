
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import JournalCard from './components/JournalCard';
import AdminLogin from './components/AdminLogin';
import PortfolioGallery from './components/PortfolioGallery';
import { Category, PortfolioItem, BlogPost, SiteSettings } from './types';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS, INITIAL_SETTINGS, K } from './constants';
import { Plus, Trash2, Camera, LogOut, Image as ImageIcon, X, Edit3, ChevronLeft, ChevronRight, Mail, Users, CheckCircle2, Settings, Globe, ShieldCheck, Pin } from 'lucide-react';

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
  onUpdateSettings: (settings: SiteSettings) => void,
  onUpdatePassword: (old: string, updated: string) => boolean,
  onTogglePinItem: (id: string, pinned: boolean) => void,
  onTogglePinBlog: (id: string, pinned: boolean) => void
}> = ({
  portfolio, blogs, subscribers, siteSettings, onLogout,
  onAddItem, onAddBlog, onDeleteItem, onDeleteBlog, onUpdateItem, onUpdateBlog,
  onDeleteSubscriber, onUpdateSubscriber, onUpdateSettings, onUpdatePassword,
  onTogglePinItem, onTogglePinBlog
}) => {
    const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'subscribers' | 'settings' | 'security'>('portfolio');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Security Form State
    const [pwdCurrent, setPwdCurrent] = useState('');
    const [pwdNew, setPwdNew] = useState('');
    const [pwdConfirm, setPwdConfirm] = useState('');

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

    const handleSecurityUpdate = () => {
      if (!pwdCurrent || !pwdNew || !pwdConfirm) {
        alert("Please fill in all security fields.");
        return;
      }
      if (pwdNew !== pwdConfirm) {
        alert("New passwords do not match!");
        return;
      }
      if (onUpdatePassword(pwdCurrent, pwdNew)) {
        alert("Studio access key updated successfully!");
        setPwdCurrent('');
        setPwdNew('');
        setPwdConfirm('');
      } else {
        alert("Verification failed.");
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
      <div className="max-w-[1600px] mx-auto px-6 py-12 min-h-screen animate-in fade-in">
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
                {activeTab === 'subscribers' ? 'Records' : (activeTab === 'settings' ? 'Site Config' : (activeTab === 'security' ? 'Auth' : (editingId ? 'Edit' : 'Create')))}
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
                Gallery
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
              <button
                type="button"
                onClick={() => { setActiveTab('security'); resetForm(); }}
                className={`flex-1 py-2 text-[10px] uppercase tracking-widest transition-colors ${activeTab === 'security' ? 'bg-white shadow-sm font-bold' : 'text-[#A09885]'}`}
              >
                <ShieldCheck size={12} className="inline mr-1" /> Auth
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
              <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 custom-scroll">
                <div className="bg-[#F9F7F2] p-4 rounded border border-[#E5E0D5]">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Branding</h3>
                  <div className="space-y-3">
                    <input
                      placeholder="Logo"
                      value={tempSettings.navbar.logo}
                      onChange={e => setTempSettings({ ...tempSettings, navbar: { ...tempSettings.navbar, logo: e.target.value } })}
                      className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                    />
                    <input
                      placeholder="Subtitle"
                      value={tempSettings.navbar.subtitle}
                      onChange={e => setTempSettings({ ...tempSettings, navbar: { ...tempSettings.navbar, subtitle: e.target.value } })}
                      className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="bg-[#F9F7F2] p-4 rounded border border-[#E5E0D5]">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Nav Labels</h3>
                  <div className="space-y-2">
                    {Object.keys(tempSettings.navbar.links).map((key) => (
                      <div key={key} className="flex gap-2 items-center">
                        <span className="text-[10px] uppercase text-[#A09885] w-20">{key}</span>
                        <input
                          value={(tempSettings.navbar.links as any)[key]}
                          onChange={e => setTempSettings({
                            ...tempSettings,
                            navbar: {
                              ...tempSettings.navbar,
                              links: { ...tempSettings.navbar.links, [key]: e.target.value }
                            }
                          })}
                          className="w-full p-2 border border-[#E5E0D5] outline-none text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#F9F7F2] p-4 rounded border border-[#E5E0D5]">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Footer</h3>
                  <div className="space-y-3">
                    <input
                      placeholder="Subscribe Title"
                      value={tempSettings.footer.subscribeTitle}
                      onChange={e => setTempSettings({ ...tempSettings, footer: { ...tempSettings.footer, subscribeTitle: e.target.value } })}
                      className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                    />
                    <input
                      placeholder="Contact Tag"
                      value={tempSettings.footer.contactTag}
                      onChange={e => setTempSettings({ ...tempSettings, footer: { ...tempSettings.footer, contactTag: e.target.value } })}
                      className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                    />
                    <input
                      placeholder="Contact Email"
                      value={tempSettings.footer.contactEmail}
                      onChange={e => setTempSettings({ ...tempSettings, footer: { ...tempSettings.footer, contactEmail: e.target.value } })}
                      className="w-full p-2 border border-[#E5E0D5] outline-none text-xs"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { onUpdateSettings(tempSettings); alert("Configurations synced."); }}
                  className="w-full py-4 bg-[#2C2C2C] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors"
                >
                  Sync Settings
                </button>
              </div>
            ) : activeTab === 'security' ? (
              <div className="space-y-6">
                <div className="bg-[#F9F7F2] p-6 rounded border border-[#E5E0D5]">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-[#E5E0D5] pb-2 flex items-center gap-2">
                    <ShieldCheck size={16} /> Access Control
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase text-[#706C61] mb-1">Current Key</label>
                      <input
                        type="password"
                        value={pwdCurrent}
                        onChange={e => setPwdCurrent(e.target.value)}
                        className="w-full p-3 border text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#706C61] mb-1">New Access Key</label>
                      <input
                        type="password"
                        value={pwdNew}
                        onChange={e => setPwdNew(e.target.value)}
                        className="w-full p-3 border text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#706C61] mb-1">Confirm New Key</label>
                      <input
                        type="password"
                        value={pwdConfirm}
                        onChange={e => setPwdConfirm(e.target.value)}
                        className="w-full p-3 border text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSecurityUpdate}
                  className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                >
                  Save New Access Key
                </button>
              </div>
            ) : (
              <div className="text-center p-8 bg-[#F9F7F2]">
                <Users size={32} className="mx-auto mb-4 text-[#A09885]" />
                <h3 className="text-lg serif italic">Audience Overview</h3>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            {(activeTab === 'settings' || activeTab === 'security') ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-6 border border-[#E5E0D5] rounded shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 border-b border-[#E5E0D5] pb-2">Hero Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Tagline</label>
                        <input value={tempSettings.hero.tag} onChange={e => setTempSettings({ ...tempSettings, hero: { ...tempSettings.hero, tag: e.target.value } })} className="w-full p-2 border text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Hero Title</label>
                        <textarea value={tempSettings.hero.title} onChange={e => setTempSettings({ ...tempSettings, hero: { ...tempSettings.hero, title: e.target.value } })} className="w-full p-2 border text-xs" rows={2} />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#706C61] mb-1">Description</label>
                        <textarea value={tempSettings.hero.description} onChange={e => setTempSettings({ ...tempSettings, hero: { ...tempSettings.hero, description: e.target.value } })} className="w-full p-2 border text-xs" rows={3} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 border border-[#E5E0D5] rounded shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 border-b border-[#E5E0D5] pb-2">Connect Icons</h3>
                    <div className="space-y-2">
                      <input placeholder="Instagram" value={tempSettings.navbar.socials.instagram} onChange={e => setTempSettings({ ...tempSettings, navbar: { ...tempSettings.navbar, socials: { ...tempSettings.navbar.socials, instagram: e.target.value } } })} className="w-full p-2 border text-[10px]" />
                      <input placeholder="Facebook" value={tempSettings.navbar.socials.facebook} onChange={e => setTempSettings({ ...tempSettings, navbar: { ...tempSettings.navbar, socials: { ...tempSettings.navbar.socials, facebook: e.target.value } } })} className="w-full p-2 border text-[10px]" />
                      <input placeholder="YouTube" value={tempSettings.navbar.socials.youtube} onChange={e => setTempSettings({ ...tempSettings, navbar: { ...tempSettings.navbar, socials: { ...tempSettings.navbar.socials, youtube: e.target.value } } })} className="w-full p-2 border text-[10px]" />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white p-6 border border-[#E5E0D5] rounded shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest mb-6 border-b border-[#E5E0D5] pb-2">Home Sections</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Apparel Tag</label>
                          <input value={tempSettings.homeSections.apparelTag} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, apparelTag: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Apparel Title</label>
                          <input value={tempSettings.homeSections.apparelTitle} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, apparelTitle: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Fibre Tag</label>
                          <input value={tempSettings.homeSections.fibreTag} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, fibreTag: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Fibre Title</label>
                          <input value={tempSettings.homeSections.fibreTitle} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, fibreTitle: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Visual Tag</label>
                          <input value={tempSettings.homeSections.visualTag} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, visualTag: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Visual Title</label>
                          <input value={tempSettings.homeSections.visualTitle} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, visualTitle: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E0D5]">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Journal Tag</label>
                          <input value={tempSettings.homeSections.archiveTag} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, archiveTag: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase text-[#A09885]">Journal Title</label>
                          <input value={tempSettings.homeSections.archiveTitle} onChange={e => setTempSettings({ ...tempSettings, homeSections: { ...tempSettings.homeSections, archiveTitle: e.target.value } })} className="w-full p-2 border text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeTab === 'portfolio' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolio.map(item => (
                      <div key={item.id} className="bg-white p-4 border border-[#E5E0D5] flex items-center space-x-4">
                        <div className="w-12 h-20 flex-shrink-0 bg-[#E5E0D5] overflow-hidden">
                          <img src={item.imageUrls[0]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="serif text-lg truncate">{item.title}</h4>
                          <p className="text-[10px] uppercase text-[#A09885]">{item.category}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => onTogglePinItem(item.id, !item.isPinned)} className={`p-2 transition-colors ${item.isPinned ? 'text-yellow-600' : 'text-[#706C61] hover:text-black'}`} title={item.isPinned ? "Unpin" : "Pin to Top"}>
                            <Pin size={18} fill={item.isPinned ? "currentColor" : "none"} />
                          </button>
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
                      <div key={blog.id} className="bg-white p-4 border border-[#E5E0D5] flex items-center space-x-4">
                        <div className="w-12 h-20 flex-shrink-0 bg-[#E5E0D5] overflow-hidden">
                          <img src={blog.imageUrls[0]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="serif text-lg truncate">{blog.title}</h4>
                          <p className="text-[10px] uppercase text-[#A09885]">{blog.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => onTogglePinBlog(blog.id, !blog.isPinned)} className={`p-2 transition-colors ${blog.isPinned ? 'text-yellow-600' : 'text-[#706C61] hover:text-black'}`} title={blog.isPinned ? "Unpin" : "Pin to Top"}>
                            <Pin size={18} fill={blog.isPinned ? "currentColor" : "none"} />
                          </button>
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
                  <div className="bg-white border border-[#E5E0D5] overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-[#F9F7F2] border-b border-[#E5E0D5]">
                          <th className="p-4 uppercase text-[10px]">Email</th>
                          <th className="p-4 text-right uppercase text-[10px]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map(sub => (
                          <tr key={sub.id} className="border-b border-[#E5E0D5] last:border-0">
                            <td className="p-4 font-medium">{sub.email}</td>
                            <td className="p-4 text-right">
                              <button onClick={() => onDeleteSubscriber(sub.id)} className="text-red-400 hover:text-red-600">
                                <Trash2 size={16} className="inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

// CategoryPage Component
const CategoryPage: React.FC<{
  category: Category;
  items: PortfolioItem[];
  onItemClick: (item: PortfolioItem) => void
}> = ({ category, items, onItemClick }) => {
  const filteredItems = items
    .filter(item => item.category === category)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">{category}</p>
          <h2 className="text-5xl serif italic">Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredItems.map((item) => (
            <div key={item.id} className="cursor-pointer group flex flex-col" onClick={() => onItemClick(item)}>
              <div className="aspect-[9/16] overflow-hidden mb-6 bg-[#E5E0D5] relative shadow-sm">
                <img
                  src={item.imageUrls[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {item.imageUrls.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-white/90 px-2 py-1 text-[8px] uppercase tracking-widest">
                    +{item.imageUrls.length - 1} Images
                  </div>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#706C61] mb-2">{item.subtitle}</p>
              <h3 className="text-xl serif mb-2 group-hover:italic transition-all">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// JournalPage Component
const JournalPage: React.FC<{
  blogs: BlogPost[];
  onBlogClick: (blog: BlogPost) => void
}> = ({ blogs, onBlogClick }) => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 animate-in fade-in duration-700 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#706C61] mb-2">The Archive</p>
          <h2 className="text-5xl serif italic">Journal</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs
            .sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return 0; // Maintain date order otherwise (blogs are typically already sorted by date)
            })
            .map((post) => (
              <JournalCard key={post.id} post={post} onClick={onBlogClick} />
            ))}
        </div>
      </div>
    </div>
  );
};

// BlogDetail Component
const BlogDetail: React.FC<{
  post: BlogPost | null;
  onClose: () => void
}> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#F9F7F2] overflow-y-auto animate-in slide-in-from-bottom duration-500" onClick={onClose}>
      <button
        onClick={onClose}
        className="fixed top-8 right-8 p-2 text-[#2C2C2C] hover:scale-110 transition-transform z-[110] bg-white/50 rounded-full md:bg-transparent"
      >
        <X size={32} strokeWidth={1} />
      </button>
      <div className="max-w-4xl mx-auto px-6 py-24" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-[#706C61] mb-4">{post.date}</p>
          <h1 className="text-4xl md:text-6xl serif mb-8 leading-tight">{post.title}</h1>
          <div className="w-12 h-[1px] bg-[#2C2C2C] mx-auto"></div>
        </div>

        <div className="space-y-12">
          {post.imageUrls.map((url, idx) => (
            <div key={idx} className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#E5E0D5] shadow-lg">
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}

          <div className="prose prose-stone mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-[#2C2C2C] font-light whitespace-pre-wrap first-letter:text-5xl first-letter:serif first-letter:float-left first-letter:mr-3">
              {post.content}
            </p>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-[#E5E0D5] text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#A09885] mb-2">Curated By</p>
          <p className="text-2xl serif italic">{post.author}</p>
          <button
            onClick={onClose}
            className="mt-12 inline-block px-10 py-3 border border-[#2C2C2C] text-xs uppercase tracking-widest hover:bg-[#2C2C2C] hover:text-white transition-all"
          >
            Close Entry
          </button>
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
  const sortedBlogs = [...blogs].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
  const featuredBlog = sortedBlogs.length > 0 ? sortedBlogs[0] : null;
  const otherBlogs = sortedBlogs.slice(1, 5);

  return (
    <div className="animate-in fade-in duration-700">
      <Hero settings={siteSettings.hero} />

      {/* Hand-written banner removed as requested */}

      <CategorySection
        category={Category.APPAREL}
        items={portfolio}
        link="/apparel"
        onItemClick={onItemClick}
        customTitle={siteSettings.homeSections.apparelTitle}
        customTag={siteSettings.homeSections.apparelTag}
      />
      <CategorySection
        category={Category.FIBRE}
        items={portfolio}
        link="/fibre"
        onItemClick={onItemClick}
        customTitle={siteSettings.homeSections.fibreTitle}
        customTag={siteSettings.homeSections.fibreTag}
      />
      <CategorySection
        category={Category.VISUAL}
        items={portfolio}
        link="/visual"
        onItemClick={onItemClick}
        customTitle={siteSettings.homeSections.visualTitle}
        customTag={siteSettings.homeSections.visualTag}
      />

      <section className="py-24 px-4 md:px-12 bg-[#F9F7F2]">
        <div className="max-w-[1600px] mx-auto">
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
                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80 mb-4">{featuredBlog.date}</p>
                <h3 className="text-3xl md:text-6xl serif mb-6 leading-tight break-words line-clamp-2">{featuredBlog.title}</h3>
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

// Main App
const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('elena_portfolio_v7');
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
    } catch (e) { return INITIAL_PORTFOLIO; }
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('elena_blogs_v7');
      return saved ? JSON.parse(saved) : INITIAL_BLOGS;
    } catch (e) { return INITIAL_BLOGS; }
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const saved = localStorage.getItem('elena_subscribers_v7');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('elena_settings_v7');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch (e) { return INITIAL_SETTINGS; }
  });

  const [adminAuthKey, setAdminAuthKey] = useState(() => {
    return localStorage.getItem('elena_admin_secret') || K;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('elena_auth') === 'true');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('elena_portfolio_v7', JSON.stringify(portfolio));
      localStorage.setItem('elena_blogs_v7', JSON.stringify(blogs));
      localStorage.setItem('elena_subscribers_v7', JSON.stringify(subscribers));
      localStorage.setItem('elena_settings_v7', JSON.stringify(siteSettings));
    } catch (e) { console.error("Storage Error"); }
  }, [portfolio, blogs, subscribers, siteSettings]);

  const handleSubscribe = (email: string) => {
    const newSub: Subscriber = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setSubscribers([newSub, ...subscribers]);
    setToastMessage('Subscription confirmed');
  };

  const handleAdminLogin = (passwordAttempt: string) => {
    // Allows login using EITHER the custom saved key OR the master key from K
    if (passwordAttempt === adminAuthKey || passwordAttempt === K) {
      setIsLoggedIn(true);
      localStorage.setItem('elena_auth', 'true');
      return true;
    }
    return false;
  };

  const handleUpdatePassword = (oldPass: string, newPass: string) => {
    // Can only change the custom key if they know the current one (or the master recovery key)
    if (oldPass === adminAuthKey || oldPass === K) {
      setAdminAuthKey(newPass);
      localStorage.setItem('elena_admin_secret', newPass);
      return true;
    }
    return false;
  };

  const handleDeleteSubscriber = (id: string) => {
    if (window.confirm('Remove subscriber?')) {
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
            {/* The hidden route to access the studio dashboard */}
            <Route path="/studio" element={
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
                  onUpdatePassword={handleUpdatePassword}
                  onTogglePinItem={(id, pinned) => setPortfolio(portfolio.map(p => p.id === id ? { ...p, isPinned: pinned } : p))}
                  onTogglePinBlog={(id, pinned) => setBlogs(blogs.map(b => b.id === id ? { ...b, isPinned: pinned } : b))}
                />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
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
