
import React, { useState, useEffect } from 'react';
import type { AppUser } from '../../types';
import { supabase } from '../../lib/supabase';
import { SearchIcon, DownloadIcon, SpinnerIcon, CheckCircleIcon, ExclamationCircleIcon, TrashIcon, CogIcon, DocumentTextIcon, CloseIcon } from '../../components/icons';
import AdminTableSkeleton from '../../components/skeletons/AdminTableSkeleton';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [showSqlHelper, setShowSqlHelper] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mappedUsers: AppUser[] = data.map(profile => ({
                    id: profile.id,
                    name: profile.full_name,
                    email: profile.email,
                    profilePicture: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`,
                    businessName: profile.business_name || '-',
                    role: profile.role as 'user' | 'admin',
                    joinDate: profile.created_at,
                    phoneNumber: profile.phone_number,
                    address: profile.address,
                    businessCategory: profile.business_type,
                    nib: profile.nib,
                    website: profile.website
                }));
                setUsers(mappedUsers);
            }
        } catch (err: any) {
            console.error("Gagal memuat pengguna:", err);
            showStatus('error', 'Gagal memuat data pengguna dari database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
        setStatusMsg({ type, text });
        if (type !== 'info') {
            setTimeout(() => setStatusMsg(null), 6000);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        const userToDelete = users.find(u => u.id === userId);
        const isConfirmed = window.confirm(
            `HAPUS TOTAL USER & PRODUK?\n\nUser: ${userToDelete?.name}\n\nSemua produk di marketplace yang diunggah oleh user ini akan DIHAPUS PERMANEN.\n\nLanjutkan?`
        );
        
        if (!isConfirmed) return;

        setIsDeletingId(userId);
        showStatus('info', 'Sedang membersihkan database...');

        try {
            const { data: userProducts } = await supabase
                .from('products')
                .select('id')
                .eq('seller_id', userId);
            
            if (userProducts && userProducts.length > 0) {
                const productIds = userProducts.map(p => p.id);
                await supabase.from('wishlist').delete().in('product_id', productIds);
                await supabase.from('products').delete().in('id', productIds);
            }

            await Promise.all([
                supabase.from('wishlist').delete().eq('user_id', userId),
                supabase.from('following').delete().or(`follower_id.eq.${userId},followed_id.eq.${userId}`),
                supabase.from('forum_posts').delete().eq('author_id', userId),
                supabase.from('notifications').delete().eq('user_id', userId)
            ]);

            await supabase.from('forum_threads').delete().eq('author_id', userId);

            const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (profileError) throw profileError;

            setUsers(prev => prev.filter(user => user.id !== userId));
            showStatus('success', `Akun milik ${userToDelete?.name} telah dihapus.`);
            
        } catch (err: any) {
            console.error("Penghapusan gagal:", err);
            showStatus('error', `Gagal: ${err.message || 'Error Database'}`);
        } finally {
            setIsDeletingId(null);
        }
    };

    const sqlFixScript = `-- === 1. PERBAIKAN MARKETPLACE & STORAGE ===
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- === 2. SETUP TABEL NOTIFIKASI REAL-TIME ===
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL, -- 'comment', 'event', 'new_member', 'wishlist_update'
    title text NOT NULL,
    description text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Izinkan sistem/user menambah notifikasi (diperlukan untuk trigger forum)
DROP POLICY IF EXISTS "Anyone can create notifications" ON public.notifications;
CREATE POLICY "Anyone can create notifications" 
ON public.notifications FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Aktifkan Realtime untuk tabel notifikasi
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- === 3. SETUP CASCADE DELETE ===
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_seller_id_fkey, ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;`;

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-gray-600 mt-1">Kelola profil dan konfigurasi notifikasi database.</p>
                </div>
                <button 
                    onClick={() => setShowSqlHelper(!showSqlHelper)}
                    className={`flex items-center px-6 py-3 rounded-2xl font-bold transition-all shadow-sm ${showSqlHelper ? 'bg-primary-600 text-white' : 'bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50'}`}
                >
                    <CogIcon className="h-5 w-5 mr-2" />
                    Buka DB Fixer
                </button>
            </div>

            {showSqlHelper && (
                <div className="mb-8 bg-gray-900 rounded-3xl p-8 border border-gray-800 animate-fade-in-up">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-white font-black text-xl flex items-center gap-2">
                                <DocumentTextIcon className="h-6 w-6 text-primary-400" />
                                SQL Master Fix Script (Real-time Notifications)
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">Salin skrip ini ke SQL Editor Supabase untuk mengaktifkan sistem Notifikasi Nyata & Real-time.</p>
                        </div>
                        <button onClick={() => setShowSqlHelper(false)} className="text-gray-500 hover:text-white"><CloseIcon className="h-6 w-6" /></button>
                    </div>
                    <pre className="bg-black/50 p-6 rounded-xl text-primary-300 text-xs font-mono overflow-x-auto border border-white/5 leading-relaxed">
                        {sqlFixScript}
                    </pre>
                </div>
            )}

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-6 md:p-10">
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-gray-700 font-medium"
                    />
                    <SearchIcon className="absolute left-5 top-4.5 h-6 w-6 text-gray-400" />
                </div>

                {statusMsg && (
                    <div className={`mb-8 p-4 rounded-2xl flex items-center gap-4 border animate-fade-in-up ${
                        statusMsg.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 
                        statusMsg.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                        'bg-red-50 border-red-100 text-red-700'
                    }`}>
                        <div className="flex-shrink-0">
                            {statusMsg.type === 'success' ? <CheckCircleIcon className="h-6 w-6" /> : 
                             statusMsg.type === 'info' ? <SpinnerIcon className="h-6 w-6 animate-spin" /> :
                             <ExclamationCircleIcon className="h-6 w-6" />}
                        </div>
                        <span className="text-sm font-bold">{statusMsg.text}</span>
                    </div>
                )}

                {loading ? (
                    <AdminTableSkeleton cols={5} rows={8} />
                ) : (
                    <div className="overflow-x-auto rounded-2xl">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-5">Identitas</th>
                                    <th className="px-6 py-5">Bisnis</th>
                                    <th className="px-6 py-5">Hak Akses</th>
                                    <th className="px-6 py-5">Gabung</th>
                                    <th className="px-6 py-5 text-right">Opsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                    <tr key={user.id} className={`bg-white hover:bg-gray-50/80 transition-all group ${isDeletingId === user.id ? 'opacity-30 pointer-events-none' : ''}`}>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-4">
                                                <img src={user.profilePicture} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                                <div className="min-w-0">
                                                    <p className="font-black text-gray-900 text-base truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-bold text-gray-700 line-clamp-1">{user.businessName}</p>
                                            <p className="text-[10px] text-primary-500 font-black uppercase mt-0.5">{user.businessCategory || 'Lainnya'}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <p className="text-xs font-mono font-bold text-gray-400">
                                                {new Date(user.joinDate).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-6 text-right whitespace-nowrap">
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={isDeletingId !== null}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all ${
                                                    isDeletingId === user.id 
                                                    ? 'bg-gray-100 text-gray-300' 
                                                    : 'text-red-500 hover:bg-red-50 hover:text-red-700 active:scale-95'
                                                }`}
                                            >
                                                {isDeletingId === user.id ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
                                                {isDeletingId === user.id ? 'MENGHAPUS...' : 'HAPUS TOTAL'}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold">Tidak ada pengguna ditemukan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
