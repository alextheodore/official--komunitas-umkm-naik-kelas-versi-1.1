
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogoIcon, SearchIcon, UserCircleIcon, MenuIcon, CloseIcon, ChevronDownIcon, CogIcon, BellIcon, CalendarIcon, ForumIcon, HeartIcon, LogoutIcon, EmailIcon, PhoneIcon, MarketplaceIcon, ExclamationCircleIcon, ChatBotIcon } from './icons';
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
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                {/* Logo Section */}
                <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                  <div className="flex items-center space-x-3">
                    <LogoIcon className="h-14 w-auto text-primary-600" />
                    <span className="text-xl font-bold text-gray-800 hidden sm:inline tracking-tight hover:text-primary-600 transition-colors">Komunitas UMKM Naik Kelas</span>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center md:gap-x-4 lg:gap-x-8">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `text-sm lg:text-base font-medium transition-all duration-200 hover:text-primary-600 whitespace-nowrap relative group ${
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
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Cari"
                  >
                    <SearchIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </button>

                  <button
                    onClick={handleSellClick}
                    className="flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white p-2 lg:px-6 lg:py-2.5 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-200 group border border-primary-400/20"
                    aria-label="Jual Produk Anda"
                  >
                    <MarketplaceIcon className="h-5 w-5 lg:h-6 lg:w-6 transition-transform group-hover:scale-110 duration-300" />
                    <span className="hidden lg:inline-block ml-2 text-sm font-bold tracking-wide">Jual Produk</span>
                  </button>
                  
                  {currentUser ? (
                    <>
                      <Link to="/marketplace?filter=wishlist" className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors hidden md:block" aria-label="Wishlist">
                        <HeartIcon className="h-6 w-6" />
                        {wishlist.length > 0 && (
                          <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-[10px] font-bold transform translate-y-0 translate-x-[2px] rounded-full bg-primary-600 text-white ring-2 ring-white">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>

                      {/* REAL NOTIFICATIONS UI */}
                      <div className="relative hidden md:block" ref={notificationsRef}>
                         <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Notifikasi">
                            <BellIcon className={`h-6 w-6 ${unreadCount > 0 ? 'animate-bounce-slow text-primary-500' : ''}`} />
                            {unreadCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">
                                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                                    <h3 className="text-sm font-bold text-gray-800">Notifikasi ({unreadCount})</h3>
                                    {unreadCount > 0 && (
                                         <button onClick={markAllAsRead} className="text-xs font-semibold text-primary-600 hover:underline">Tandai dibaca</button>
                                    )}
                                </div>
                                <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                                    {notifications.length > 0 ? notifications.map((notification) => (
                                        <li key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-primary-50/30' : ''}`}>
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <NotificationItemIcon type={notification.type} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 leading-snug">{notification.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-medium">{notification.description}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase">{notification.timestamp}</p>
                                                </div>
                                            </div>
                                        </li>
                                    )) : (
                                        <li className="p-8 text-center text-sm text-gray-500">Belum ada notifikasi baru.</li>
                                    )}
                                </ul>
                                <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                                    <Link to="/profile" className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wide">Lihat Profil</Link>
                                </div>
                            </div>
                        )}
                      </div>

                      <div className="relative hidden md:block" ref={profileRef}>
                        <button
                          onClick={() => setIsProfileOpen(!isProfileOpen)}
                          className="flex items-center space-x-2 focus:outline-none p-1 pl-2 pr-1 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 group"
                        >
                          <span className="text-sm font-semibold text-gray-700 hidden lg:block group-hover:text-gray-900">{currentUser.name.split(' ')[0]}</span>
                          <img
                            src={currentUser.profilePicture}
                            alt={currentUser.name}
                            className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-gray-200 transition-all"
                          />
                          <ChevronDownIcon className="h-4 w-4 text-gray-400 hidden lg:block group-hover:text-gray-600 transition-transform duration-200" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </button>

                        {isProfileOpen && (
                          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center space-x-3">
                                    <img src={currentUser.profilePicture} alt="" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-1">
                                <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                    <UserCircleIcon className="h-4 w-4 mr-3" /> Profil Saya
                                </Link>
                                {currentUser.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                                        <CogIcon className="h-4 w-4 mr-3" /> Admin Panel
                                    </Link>
                                )}
                            </div>
                            <div className="py-1 border-t border-gray-100">
                                <button onClick={handleLogoutClick} className="w-full text-left flex items-center px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <LogoutIcon className="h-4 w-4 mr-3" /> Keluar
                                </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="hidden md:flex items-center space-x-3">
                      <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors px-4 py-2.5 rounded-lg hover:bg-gray-50">Masuk</Link>
                      <Link to="/register" className="text-sm font-bold text-white bg-gray-900 hover:bg-black px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Daftar</Link>
                    </div>
                  )}

                  <div className="md:hidden flex items-center ml-2 space-x-1">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                      {isMenuOpen ? <CloseIcon className="block h-6 w-6" /> : (
                        <div className="relative">
                            <MenuIcon className="block h-6 w-6" />
                            {unreadCount > 0 && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>}
                        </div>
                      )}
                    </button>
                    <button onClick={onOpenChat} className="p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                        <ChatBotIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
        
        {location.pathname === '/' && (
            <div className="md:hidden bg-gradient-to-r from-primary-50 to-white border-b border-primary-100 py-2.5 px-4 shadow-sm">
                 <Link to="/marketplace" className="flex items-center justify-center text-sm font-bold text-primary-700 hover:text-primary-800">
                    <MarketplaceIcon className="w-4 h-4 mr-2" /> Belanja di Marketplace
                 </Link>
            </div>
        )}

        <Breadcrumbs />

        {isMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%)] left-0 w-full bg-white border-b border-gray-200 shadow-2xl z-40 max-h-[calc(100vh-5rem)] overflow-y-auto animate-fade-in-up origin-top">
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive ? 'bg-primary-50 text-primary-600 translate-x-1' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600 hover:translate-x-1'}`}>
                  {link.text}
                </NavLink>
              ))}

              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-600 hover:translate-x-1 transition-all">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BellIcon className="h-5 w-5 mr-3" /> Notifikasi
                    </div>
                    {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">{unreadCount}</span>}
                 </div>
              </Link>

              {currentUser && (
                  <Link to="/marketplace?filter=wishlist" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-600 hover:translate-x-1 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <HeartIcon className="h-5 w-5 mr-3" /> Wishlist
                        </div>
                        {wishlist.length > 0 && <span className="bg-primary-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">{wishlist.length}</span>}
                     </div>
                  </Link>
              )}

              <div className="border-t border-gray-100 pt-6 mt-6">
                {currentUser ? (
                  <>
                    <div className="flex items-center px-4 mb-6 bg-gray-50 p-4 rounded-xl mx-2">
                      <img src={currentUser.profilePicture} alt={currentUser.name} className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div className="ml-3">
                        <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-600 hover:translate-x-1 transition-all">
                      <div className="flex items-center"><UserCircleIcon className="h-5 w-5 mr-3" /> Profil Saya</div>
                    </Link>
                    {currentUser.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-600 hover:translate-x-1 transition-all">
                        <div className="flex items-center"><CogIcon className="h-5 w-5 mr-3" /> Admin Panel</div>
                        </Link>
                    )}
                    <button onClick={handleLogoutClick} className="w-full text-left block px-4 py-3 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50 hover:translate-x-1 transition-all">
                      <div className="flex items-center"><LogoutIcon className="h-5 w-5 mr-3" /> Keluar</div>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 px-4">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors">Masuk</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex justify-center items-center px-4 py-3 border border-transparent rounded-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-all">Daftar</Link>
                  </div>
                )}
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
