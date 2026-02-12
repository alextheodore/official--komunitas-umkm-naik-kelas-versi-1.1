
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
// Added WhatsAppIcon and InstagramIcon to imports
import { LogoIcon, SearchIcon, UserCircleIcon, MenuIcon, CloseIcon, ChevronDownIcon, CogIcon, BellIcon, CalendarIcon, ForumIcon, HeartIcon, LogoutIcon, EmailIcon, PhoneIcon, MarketplaceIcon, ExclamationCircleIcon, ChatBotIcon, WhatsAppIcon, InstagramIcon } from './icons';
import SearchModal from './SearchModal';
import { useAuth } from '../contexts/AuthContext';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import type { Notification } from '../types';
import Breadcrumbs from './Breadcrumbs';
import ListProductModal from './ListProductModal';
import { supabase } from '../lib/supabase';

const NotificationItemIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'comment':
            return <ForumIcon className="h-6 w-6 text-blue-500" />;
        case 'event':
            return <CalendarIcon className="h-6 w-6 text-purple-500" />;
        case 'new_member':
            return <UserCircleIcon className="h-6 w-6 text-green-500" />;
        case 'wishlist_update':
            return <HeartIcon className="h-6 w-6 text-pink-500" filled={true} />;
        default:
            return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
};

interface HeaderProps {
    onOpenChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenChat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isListProductModalOpen, setIsListProductModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { currentUser, logout, wishlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // REAL-TIME NOTIFICATIONS FETCHING
  useEffect(() => {
    if (!currentUser) {
        setNotifications([]);
        return;
    }

    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (!error && data) {
            setNotifications(data.map(n => ({
                id: n.id,
                type: n.type as Notification['type'],
                title: n.title,
                description: n.description,
                timestamp: formatTimeAgo(n.created_at),
                read: n.read
            })));
        }
    };

    fetchNotifications();

    // Listen for real-time inserts
    const channel = supabase
        .channel('realtime_notifications')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications', 
            filter: `user_id=eq.${currentUser.id}` 
        }, (payload) => {
            const newNotif = payload.new as any;
            setNotifications(prev => [{
                id: newNotif.id,
                type: newNotif.type as Notification['type'],
                title: newNotif.title,
                description: newNotif.description,
                timestamp: 'Baru saja',
                read: false
            }, ...prev]);
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const formatTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const markAllAsRead = async () => {
      if (!currentUser) return;
      const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', currentUser.id);

      if (!error) {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleSellClick = () => {
    if (!currentUser) {
        navigate('/login');
        return;
    }
    setIsListProductModalOpen(true);
  };

  const handleAddProduct = (product: any) => {
      setIsListProductModalOpen(false);
      navigate('/marketplace');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, profileRef, notificationsRef]);

  const navLinks = [
    { to: '/programs', text: 'Program' },
    { to: '/forum', text: 'Forum' },
    { to: '/marketplace', text: 'Marketplace' },
    { to: '/events', text: 'Event' },
    { to: '/blog', text: 'Blog' },
    { to: '/contact', text: 'Kontak' },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-sm border-b border-gray-100">
        <div className="">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 md:h-20">
                {/* Logo Section */}
                <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <LogoIcon className="h-10 md:h-14 w-auto text-primary-600" />
                    <span className="text-base md:text-xl font-bold text-gray-800 hidden sm:inline tracking-tight">Komunitas UMKM</span>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center md:gap-x-4 lg:gap-x-8">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `text-sm lg:text-base font-bold transition-all duration-200 hover:text-primary-600 whitespace-nowrap relative group ${
                          isActive ? 'text-primary-600' : 'text-gray-600'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.text}
                          <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>

                {/* Actions Section */}
                <div className="flex items-center space-x-1.5 md:space-x-4">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    aria-label="Cari"
                  >
                    <SearchIcon className="h-5 w-5 md:h-6 md:w-6" />
                  </button>

                  <button
                    onClick={handleSellClick}
                    className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white p-2 md:px-5 md:py-2.5 rounded-full shadow-md shadow-primary-200 transition-all active:scale-95 group"
                    aria-label="Jual Produk"
                  >
                    <MarketplaceIcon className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="hidden lg:inline-block ml-2 text-sm font-black uppercase tracking-wider">Jual</span>
                  </button>
                  
                  {currentUser ? (
                    <>
                      <Link to="/marketplace?filter=wishlist" className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hidden md:block" aria-label="Wishlist">
                        <HeartIcon className="h-6 w-6" />
                        {wishlist.length > 0 && (
                          <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-[10px] font-bold rounded-full bg-primary-600 text-white ring-2 ring-white">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>

                      <div className="relative hidden md:block" ref={notificationsRef}>
                         <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Notifikasi">
                            <BellIcon className={`h-6 w-6 ${unreadCount > 0 ? 'animate-bounce-slow text-primary-500' : ''}`} />
                            {unreadCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden z-50 animate-fade-in-up origin-top-right">
                                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                                    <h3 className="text-sm font-bold text-gray-800">Notifikasi ({unreadCount})</h3>
                                    {unreadCount > 0 && (
                                         <button onClick={markAllAsRead} className="text-xs font-semibold text-primary-600">Tandai dibaca</button>
                                    )}
                                </div>
                                <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                                    {notifications.length > 0 ? notifications.map((notification) => (
                                        <li key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-primary-50/40' : ''}`}>
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <NotificationItemIcon type={notification.type} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 leading-snug">{notification.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.description}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase">{notification.timestamp}</p>
                                                </div>
                                            </div>
                                        </li>
                                    )) : (
                                        <li className="p-8 text-center text-sm text-gray-500">Belum ada notifikasi.</li>
                                    )}
                                </ul>
                            </div>
                        )}
                      </div>

                      <div className="relative hidden md:block" ref={profileRef}>
                        <button
                          onClick={() => setIsProfileOpen(!isProfileOpen)}
                          className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all border border-transparent"
                        >
                          <img
                            src={currentUser.profilePicture}
                            alt={currentUser.name}
                            className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in-up origin-top-right">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
                                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                            </div>
                            <div className="py-1">
                                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <UserCircleIcon className="h-4 w-4 mr-3" /> Profil Saya
                                </Link>
                                {currentUser.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <CogIcon className="h-4 w-4 mr-3" /> Admin Panel
                                    </Link>
                                )}
                            </div>
                            <div className="py-1 border-t border-gray-100">
                                <button onClick={handleLogoutClick} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <LogoutIcon className="h-4 w-4 mr-3" /> Keluar
                                </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="hidden md:flex items-center space-x-2">
                      <Link to="/login" className="text-sm font-bold text-gray-600 px-4 py-2 hover:text-primary-600">Masuk</Link>
                      <Link to="/register" className="text-sm font-black text-white bg-gray-900 px-5 py-2 rounded-full hover:bg-black shadow-md">Daftar</Link>
                    </div>
                  )}

                  <div className="md:hidden flex items-center ml-1">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                      {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : (
                        <div className="relative">
                            <MenuIcon className="h-6 w-6" />
                            {unreadCount > 0 && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-white"></span>}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        {/* Banner Mobile yang lebih mencolok */}
        {location.pathname === '/' && (
            <div className="md:hidden bg-primary-600 py-2.5 px-4 shadow-inner text-center">
                 <Link to="/marketplace" className="inline-flex items-center text-[11px] font-black text-white uppercase tracking-[0.15em] animate-pulse">
                    <MarketplaceIcon className="w-4 h-4 mr-2" /> Belanja di Marketplace Kami &rarr;
                 </Link>
            </div>
        )}

        <Breadcrumbs />

        {/* Mobile Sidebar Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white animate-fade-in-up">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <LogoIcon className="h-10 w-auto" />
                        <span className="font-bold text-gray-800">UMKM Naik Kelas</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500"><CloseIcon className="h-6 w-6" /></button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `block px-4 py-4 rounded-xl text-lg font-black uppercase tracking-tight ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700'}`}>
                        {link.text}
                        </NavLink>
                    ))}
                    <div className="pt-4 border-t border-gray-100 mt-4">
                        {currentUser ? (
                            <div className="space-y-2">
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-gray-700 font-bold"><UserCircleIcon className="h-5 w-5 mr-3 text-primary-500" /> Profil Saya</Link>
                                <Link to="/marketplace?filter=wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-gray-700 font-bold"><HeartIcon className="h-5 w-5 mr-3 text-red-500" /> Wishlist ({wishlist.length})</Link>
                                <button onClick={handleLogoutClick} className="w-full flex items-center px-4 py-4 text-red-600 font-bold"><LogoutIcon className="h-5 w-5 mr-3" /> Keluar</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-3.5 border border-gray-300 rounded-xl font-black text-sm text-center uppercase tracking-widest">Masuk</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="py-3.5 bg-primary-600 text-white rounded-xl font-black text-sm text-center uppercase tracking-widest shadow-lg shadow-primary-100">Daftar</Link>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="p-6 bg-gray-50 border-t flex justify-center gap-6">
                    <a href="#" className="text-gray-400"><WhatsAppIcon className="h-6 w-6" /></a>
                    <a href="#" className="text-gray-400"><InstagramIcon className="h-6 w-6" /></a>
                    <a href="#" className="text-gray-400"><EmailIcon className="h-6 w-6" /></a>
                </div>
            </div>
          </div>
        )}
      </header>
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <LogoutConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={confirmLogout} />
      <ListProductModal isOpen={isListProductModalOpen} onClose={() => setIsListProductModalOpen(false)} onAddProduct={handleAddProduct} />
    </>
  );
};

export default Header;
