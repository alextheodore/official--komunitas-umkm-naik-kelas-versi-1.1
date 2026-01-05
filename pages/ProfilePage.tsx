
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AppUser, Product } from '../types';
import { 
    UserCircleIcon, 
    BriefcaseIcon, 
    BellIcon, 
    CogIcon, 
    PencilIcon, 
    LockClosedIcon, 
    LogoutIcon, 
    IdCardIcon, 
    ChartBarIcon, 
    UsersIcon, 
    SpinnerIcon 
} from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import MemberCard from '../components/MemberCard';
import ProductCard from '../components/ProductCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import UserSkeleton from '../components/skeletons/UserSkeleton';
import FollowButton from '../components/FollowButton';

const ProfilePage: React.FC = () => {
  const { currentUser, logout, following, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const navigate = useNavigate();

  // Fetch additional data based on active tab
  useEffect(() => {
    if (currentUser) {
        if (activeTab === 'products') fetchMyProducts();
        if (activeTab === 'following') fetchFollowedUsers();
    }
  }, [currentUser, activeTab, following]);

  const fetchMyProducts = async () => {
    if (!currentUser) return;
    setLoadingProducts(true);
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', currentUser.id);
        
        if (error) throw error;

        if (data) {
            setMyProducts(data.map(p => ({
                ...p,
                seller: {
                    id: currentUser.id,
                    name: currentUser.name,
                    businessName: currentUser.businessName,
                    profilePicture: currentUser.profilePicture,
                    phone: currentUser.phoneNumber || '',
                    email: currentUser.email
                }
            })));
        }
    } catch (err) {
        console.error("Gagal memuat produk saya:", err);
    } finally {
        setLoadingProducts(false);
    }
  };

  const fetchFollowedUsers = async () => {
    if (!currentUser || following.length === 0) {
        setFollowedUsers([]);
        return;
    }
    setLoadingFollowing(true);
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, business_name, avatar_url')
            .in('id', following);
        
        if (error) throw error;
        if (data) setFollowedUsers(data);
    } catch (err) {
        console.error("Gagal memuat daftar mengikuti:", err);
    } finally {
        setLoadingFollowing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // AuthContext processing session
  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
              <SpinnerIcon className="animate-spin h-10 w-10 text-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600 font-medium">Memuat profil...</p>
          </div>
      </div>
  );
  
  // Handled by UserRoute, but good for type safety
  if (!currentUser) return null;

  const tabs = [
    { id: 'profile', label: 'Profil Saya', icon: <UserCircleIcon className="h-5 w-5 mr-2" /> },
    { id: 'member-card', label: 'Kartu Anggota', icon: <IdCardIcon className="h-5 w-5 mr-2" /> },
    { id: 'products', label: 'Produk Saya', icon: <BriefcaseIcon className="h-5 w-5 mr-2" /> },
    { id: 'following', label: 'Mengikuti', icon: <UsersIcon className="h-5 w-5 mr-2" /> },
    { id: 'settings', label: 'Pengaturan', icon: <CogIcon className="h-5 w-5 mr-2" /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Profil */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-8 animate-fade-in-up">
                <div className="relative group">
                    <img 
                        src={currentUser.profilePicture} 
                        alt={currentUser.name}
                        className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-primary-50 object-cover shadow-sm transition-transform group-hover:scale-105" 
                    />
                    <button className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-primary-600 transition-colors">
                        <PencilIcon className="h-4 w-4" />
                    </button>
                </div>
                <div className="text-center md:text-left flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{currentUser.name}</h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700 uppercase tracking-wider self-center md:self-auto">
                            {currentUser.role}
                        </span>
                    </div>
                    <p className="text-lg text-primary-600 font-bold mt-1">{currentUser.businessName}</p>
                    <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                        <span className="text-gray-400 text-sm flex items-center">
                            <ChartBarIcon className="h-4 w-4 mr-1" />
                            Bergabung {new Date(currentUser.joinDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
                        Edit Profil
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigasi */}
              <aside className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <nav className="flex flex-col p-2">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
              </aside>

              {/* Konten Utama Berdasarkan Tab */}
              <main className="lg:col-span-3">
                <div className="animate-fade-in-up transition-all duration-300">
                    {activeTab === 'profile' && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Informasi Bisnis & Pribadi</h3>
                                <PencilIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-primary-600 transition-colors" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Utama</p>
                                    <p className="font-semibold text-gray-800 break-all">{currentUser.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor WhatsApp</p>
                                    <p className="font-semibold text-gray-800">{currentUser.phoneNumber || 'Belum ditambahkan'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori Usaha</p>
                                    <p className="font-semibold text-gray-800">{currentUser.businessCategory || 'Belum diatur'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">NIB (Nomor Induk Berusaha)</p>
                                    <p className="font-semibold text-gray-800 font-mono">{currentUser.nib || 'Belum diverifikasi'}</p>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Lengkap</p>
                                    <p className="font-semibold text-gray-800 leading-relaxed">{currentUser.address || 'Alamat belum diatur'}</p>
                                </div>
                                {currentUser.website && (
                                    <div className="md:col-span-2 space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Website / Toko Online</p>
                                        <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:underline">
                                            {currentUser.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'member-card' && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                             <MemberCard user={currentUser} />
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Katalog Produk Anda</h3>
                                <button 
                                    className="w-full sm:w-auto px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-md shadow-primary-100 flex items-center justify-center gap-2"
                                    onClick={() => navigate('/marketplace')}
                                >
                                    <BriefcaseIcon className="h-4 w-4" />
                                    + Tambah Produk
                                </button>
                            </div>
                            {loadingProducts ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(2)].map((_, i) => <CardSkeleton key={i} />)}
                                </div>
                            ) : myProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {myProducts.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                                        <BriefcaseIcon className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Anda belum mengunggah produk ke marketplace.</p>
                                    <button 
                                        className="mt-4 text-primary-600 font-bold hover:underline"
                                        onClick={() => navigate('/marketplace')}
                                    >
                                        Mulai berjualan sekarang
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'following' && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                             <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">Anggota yang Diikuti</h3>
                             {loadingFollowing ? (
                                 <div className="space-y-4">
                                     {[...Array(3)].map((_, i) => <UserSkeleton key={i} />)}
                                 </div>
                             ) : followedUsers.length > 0 ? (
                                 <div className="divide-y divide-gray-100">
                                     {followedUsers.map(user => (
                                         <div key={user.id} className="py-5 flex items-center justify-between group">
                                             <div className="flex items-center gap-4">
                                                 <img 
                                                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
                                                    className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm" 
                                                    alt={user.full_name}
                                                 />
                                                 <div>
                                                     <p className="font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors">{user.full_name}</p>
                                                     <p className="text-sm text-gray-500">{user.business_name}</p>
                                                 </div>
                                             </div>
                                             <FollowButton userId={user.id} />
                                         </div>
                                     ))}
                                 </div>
                             ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                     <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                                        <UsersIcon className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Anda belum mengikuti anggota lain.</p>
                                    <Link to="/forum" className="mt-4 inline-block text-primary-600 font-bold hover:underline">
                                        Temukan relasi di forum
                                    </Link>
                                </div>
                             )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                             <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">Pengaturan Akun</h3>
                             <div className="space-y-6 max-w-md">
                                 <div className="space-y-4">
                                     <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100 group">
                                         <div className="flex items-center gap-3">
                                             <LockClosedIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
                                             <span className="font-bold text-gray-700">Ubah Kata Sandi</span>
                                         </div>
                                         <ChevronRightIcon className="h-5 w-5 text-gray-300" />
                                     </button>
                                     <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100 group">
                                         <div className="flex items-center gap-3">
                                             <BellIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
                                             <span className="font-bold text-gray-700">Preferensi Notifikasi</span>
                                         </div>
                                         <ChevronRightIcon className="h-5 w-5 text-gray-300" />
                                     </button>
                                 </div>

                                 <div className="pt-6 border-t border-gray-100">
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 shadow-sm shadow-red-50"
                                    >
                                        <LogoutIcon className="h-5 w-5" /> Keluar dari Akun
                                    </button>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
              </main>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;

// Helper icons for the page
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
