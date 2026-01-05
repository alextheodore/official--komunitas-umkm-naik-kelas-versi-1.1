
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Event, Article } from '../../types';
import ContentModal from '../../components/admin/ContentModal';
import AdminTableSkeleton from '../../components/skeletons/AdminTableSkeleton';
import { CheckCircleIcon, ExclamationCircleIcon } from '../../components/icons';

type Tab = 'events' | 'articles';
type ModalState = {
    isOpen: boolean;
    type: Tab | null;
    mode: 'add' | 'edit';
    data: Event | Article | null;
};

const ContentManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('articles');
    const [events, setEvents] = useState<Event[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null, mode: 'add', data: null });
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [artRes, eveRes] = await Promise.all([
                supabase.from('articles').select('*').order('date', { ascending: false }),
                supabase.from('events').select('*').order('date', { ascending: false })
            ]);

            if (artRes.data) {
                // Map back from snake_case to camelCase for frontend consistency
                setArticles(artRes.data.map((a: any) => ({
                    ...a,
                    authorImage: a.author_image
                })));
            }
            if (eveRes.data) setEvents(eveRes.data);
        } catch (err) {
            console.error("Gagal ambil konten:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showStatus = (type: 'success' | 'error', text: string) => {
        setStatusMsg({ type, text });
        setTimeout(() => setStatusMsg(null), 5000);
    };

    const openModal = (type: Tab, mode: 'add' | 'edit', data: Event | Article | null = null) => {
        setModalState({ isOpen: true, type, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, mode: 'add', data: null });
    };

    const handleSave = async (content: any) => {
        const table = modalState.type === 'events' ? 'events' : 'articles';
        const isEdit = modalState.mode === 'edit';

        // Prepare payload: Map camelCase to snake_case for DB
        let payload: any = { ...content };
        
        // Ensure valid date
        if (!payload.date) {
            payload.date = new Date().toISOString().split('T')[0];
        }

        if (modalState.type === 'articles') {
            const { authorImage, ...rest } = payload;
            payload = { 
                ...rest, 
                author_image: authorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.author || 'Admin')}`
            };
        }

        try {
            if (isEdit) {
                const { error } = await supabase.from(table).update(payload).eq('id', payload.id);
                if (error) throw error;
                showStatus('success', `${activeTab === 'events' ? 'Event' : 'Berita'} berhasil diperbarui.`);
            } else {
                // Remove ID for insert to let DB generate UUID
                const { id, ...newContent } = payload;
                const { error } = await supabase.from(table).insert(newContent);
                if (error) throw error;
                showStatus('success', `${activeTab === 'events' ? 'Event' : 'Berita'} berhasil diterbitkan.`);
            }
            fetchData();
            closeModal();
        } catch (err: any) {
            console.error("DB Error:", err);
            showStatus('error', `Gagal menyimpan: ${err.message || 'Kesalahan Database'}`);
        }
    };
    
    const handleDelete = async (type: Tab, id: string) => {
        if (!window.confirm('Hapus konten ini secara permanen?')) return;
        const table = type === 'events' ? 'events' : 'articles';

        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            showStatus('success', 'Konten berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showStatus('error', err.message);
        }
    }

    const renderTable = () => {
        const isEvents = activeTab === 'events';
        const data = isEvents ? events : articles;
        const headers = isEvents ? ['Judul Event', 'Kategori', 'Tanggal'] : ['Judul Berita', 'Kategori', 'Tanggal'];

        if (loading) return <AdminTableSkeleton cols={4} rows={5} />;

        return (
            <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Daftar {isEvents ? 'Event' : 'Berita'}</h2>
                    <button onClick={() => openModal(activeTab, 'add')} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all flex items-center gap-2">
                        + Tambah {isEvents ? 'Event' : 'Berita'}
                    </button>
                </div>
                
                {statusMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${statusMsg.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                        {statusMsg.type === 'success' ? <CheckCircleIcon className="h-5 w-5" /> : <ExclamationCircleIcon className="h-5 w-5" />}
                        <span className="text-sm font-medium">{statusMsg.text}</span>
                    </div>
                )}

                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 backdrop-blur-sm">
                            <tr>
                                {headers.map(h => <th key={h} scope="col" className="px-6 py-4">{h}</th>)}
                                <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.length > 0 ? data.map(item => (
                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 line-clamp-1 max-w-xs">{item.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">{new Date(item.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openModal(activeTab, 'edit', item)} className="text-primary-600 font-bold hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(activeTab, item.id)} className="text-red-600 font-bold hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Belum ada konten di kategori ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Konten (CMS)</h1>
                <p className="text-gray-600 mt-1">Publikasikan informasi terbaru untuk seluruh anggota komunitas.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                    <nav className="flex px-4" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('articles')}
                            className={`${activeTab === 'articles' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm transition-all`}
                        >
                            Berita & Artikel
                        </button>
                         <button
                            onClick={() => setActiveTab('events')}
                            className={`${activeTab === 'events' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm transition-all`}
                        >
                            Event & Pelatihan
                        </button>
                    </nav>
                </div>
                <div className="p-8">
                    {renderTable()}
                </div>
            </div>

             {modalState.isOpen && modalState.type && (
                <ContentModal 
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    onSave={handleSave}
                    contentType={modalState.type}
                    mode={modalState.mode}
                    initialData={modalState.data}
                />
            )}
        </div>
    );
};

export default ContentManagementPage;
