
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ForumIcon, CloseIcon, SearchIcon, SpinnerIcon, ExclamationCircleIcon, CheckCircleIcon } from '../../components/icons';
import AdminTableSkeleton from '../../components/skeletons/AdminTableSkeleton';

const ForumModerationPage: React.FC = () => {
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchThreads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('forum_threads')
                .select(`
                    *,
                    profiles:author_id (full_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setThreads(data || []);
        } catch (err: any) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const showStatus = (type: 'success' | 'error', text: string) => {
        setStatusMsg({ type, text });
        setTimeout(() => setStatusMsg(null), 3000);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Thread dan semua balasannya akan dihapus permanen. Lanjutkan?')) return;

        try {
            const { error } = await supabase.from('forum_threads').delete().eq('id', id);
            if (error) throw error;
            showStatus('success', 'Diskusi berhasil dihapus.');
            fetchThreads();
        } catch (err: any) {
            showStatus('error', err.message);
        }
    };

    const filtered = threads.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Moderasi Forum</h1>
                <p className="text-gray-600 mt-1">Pantau dan kelola konten diskusi komunitas untuk menjaga keamanan.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                    <div className="relative flex-grow max-w-md">
                        <input 
                            type="text" 
                            placeholder="Cari topik atau penulis..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex items-center text-sm font-bold text-gray-500">
                        Total {threads.length} Diskusi Aktif
                    </div>
                </div>

                {statusMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                        {statusMsg.type === 'success' ? <CheckCircleIcon className="h-5 w-5" /> : <ExclamationCircleIcon className="h-5 w-5" />}
                        <span className="text-sm font-medium">{statusMsg.text}</span>
                    </div>
                )}

                {loading ? (
                    <AdminTableSkeleton cols={5} rows={6} />
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Topik Diskusi</th>
                                    <th className="px-6 py-4">Penulis</th>
                                    <th className="px-6 py-4">Dibuat Pada</th>
                                    <th className="px-6 py-4">Statistik</th>
                                    <th className="px-6 py-4 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length > 0 ? filtered.map(thread => (
                                    <tr key={thread.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 line-clamp-1">{thread.title}</p>
                                            <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{thread.category}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-600">{thread.profiles?.full_name}</td>
                                        <td className="px-6 py-4 text-xs font-mono">{new Date(thread.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4 text-xs">
                                            <span className="block">{thread.views} Dilihat</span>
                                            <span className="block text-primary-500">{thread.upvotes} Upvotes</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(thread.id)}
                                                className="text-red-600 font-bold hover:underline flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <CloseIcon className="h-4 w-4" /> Hapus
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">Data diskusi tidak ditemukan.</td>
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

export default ForumModerationPage;
