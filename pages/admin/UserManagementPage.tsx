
import React, { useState, useEffect } from 'react';
import type { AppUser } from '../../types';
import { supabase } from '../../lib/supabase';
import { SearchIcon, DownloadIcon, SpinnerIcon, CheckCircleIcon, ExclamationCircleIcon } from '../../components/icons';
import AdminTableSkeleton from '../../components/skeletons/AdminTableSkeleton';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
            showStatus('error', 'Gagal memuat data pengguna.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showStatus = (type: 'success' | 'error', text: string) => {
        setStatusMsg({ type, text });
        setTimeout(() => setStatusMsg(null), 3000);
    };

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
            showStatus('success', `Role pengguna berhasil diubah menjadi ${newRole}.`);
        } catch (err: any) {
            showStatus('error', 'Gagal mengubah role.');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus profil pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.filter(user => user.id !== userId));
            showStatus('success', 'Profil pengguna berhasil dihapus.');
        } catch (err: any) {
            showStatus('error', 'Gagal menghapus pengguna.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownloadCSV = () => {
        const headers = ['ID', 'Nama', 'Email', 'Nama Bisnis', 'Role', 'Tanggal Bergabung'];
        const rows = filteredUsers.map(user => [
            user.id,
            `"${user.name}"`,
            user.email,
            `"${user.businessName}"`,
            user.role,
            new Date(user.joinDate).toLocaleDateString('id-ID')
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `data_anggota_umkm_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Pengguna</h1>
                <p className="text-gray-600 mt-1">Kelola dan monitor seluruh anggota komunitas UMKM Naik Kelas.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau bisnis..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        />
                        <SearchIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                    </div>
                    
                    <button 
                        onClick={handleDownloadCSV}
                        className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                    >
                        <DownloadIcon className="h-5 w-5 mr-2" />
                        Export ke CSV
                    </button>
                </div>

                {statusMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border animate-fade-in-up ${statusMsg.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                        {statusMsg.type === 'success' ? <CheckCircleIcon className="h-5 w-5" /> : <ExclamationCircleIcon className="h-5 w-5" />}
                        <span className="text-sm font-bold">{statusMsg.text}</span>
                    </div>
                )}

                {loading ? (
                    <AdminTableSkeleton cols={5} rows={8} />
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 backdrop-blur-sm">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Informasi Pengguna</th>
                                    <th scope="col" className="px-6 py-4">Detail Bisnis</th>
                                    <th scope="col" className="px-6 py-4">Role</th>
                                    <th scope="col" className="px-6 py-4">Bergabung</th>
                                    <th scope="col" className="px-6 py-4 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                    <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <img src={user.profilePicture} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 min-w-[150px]">
                                            <p className="font-semibold text-gray-700">{user.businessName}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{user.businessCategory}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                                                className={`text-xs font-bold px-2 py-1 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none transition-all ${
                                                    user.role === 'admin' 
                                                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                                                    : 'bg-blue-50 border-blue-200 text-blue-700'
                                                }`}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-400">
                                            {new Date(user.joinDate).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-500 font-bold hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                                            Tidak ada pengguna yang sesuai dengan pencarian Anda.
                                        </td>
                                    </tr>
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
