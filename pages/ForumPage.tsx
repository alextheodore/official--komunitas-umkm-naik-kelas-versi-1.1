
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ForumThread } from '../types';
import { supabase } from '../lib/supabase';
import { SearchIcon, ForumIcon, CalendarIcon } from '../components/icons';
import NewThreadModal from '../components/NewThreadModal';
import ThreadSkeleton from '../components/skeletons/ThreadSkeleton';
import { useAuth } from '../contexts/AuthContext';

const ForumPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchThreads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('forum_threads')
                .select(`
                    *,
                    profiles:author_id (id, full_name, avatar_url, business_name),
                    forum_posts (id)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mapped: ForumThread[] = data.map(t => ({
                id: t.id,
                title: t.title,
                category: t.category,
                author_id: t.author_id,
                author: {
                    id: t.profiles.id,
                    name: t.profiles.full_name,
                    profilePicture: t.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.profiles.full_name)}`,
                    businessName: t.profiles.business_name
                },
                createdAt: t.created_at,
                views: t.views || 0,
                upvotes: t.upvotes || 0,
                downvotes: t.downvotes || 0,
                posts: t.forum_posts || []
            }));

            setThreads(mapped);
        } catch (err) {
            console.error("Forum fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const filteredThreads = threads.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen">
            <section className="bg-primary-600 text-white py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold">Forum Diskusi</h1>
                    <p className="mt-3 text-sm md:text-lg text-primary-100 max-w-2xl mx-auto">Berbagi solusi dan kolaborasi bersama pengusaha UMKM lainnya.</p>
                </div>
            </section>
            
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-10">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Cari diskusi..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl md:rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm md:text-base"
                        />
                        <SearchIcon className="absolute left-3.5 md:left-4 top-3 md:top-4.5 h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                    </div>
                    <button 
                        onClick={() => currentUser ? setIsModalOpen(true) : alert("Silakan login untuk memulai diskusi.")}
                        className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-primary-600 text-white font-bold rounded-xl md:rounded-2xl shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95 text-sm md:text-base"
                    >
                        Mulai Diskusi Baru
                    </button>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        [...Array(5)].map((_, i) => <ThreadSkeleton key={i} />)
                    ) : filteredThreads.length > 0 ? (
                        filteredThreads.map(thread => (
                            <Link 
                                key={thread.id} 
                                to={`/forum/${thread.id}`}
                                className="block p-5 md:p-6 bg-white border border-gray-100 rounded-xl md:rounded-2xl shadow-sm hover:border-primary-200 transition-all animate-fade-in-up"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-primary-600 mb-2 uppercase tracking-widest">
                                            <span className="px-2 py-0.5 bg-primary-50 rounded border border-primary-100">{thread.category}</span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 line-clamp-2 md:line-clamp-none">{thread.title}</h3>
                                        
                                        <div className="flex items-center justify-between md:justify-start gap-4">
                                            <div className="flex items-center gap-2.5">
                                                <img src={thread.author?.profilePicture} className="h-7 w-7 md:h-8 md:w-8 rounded-full border border-gray-100 object-cover" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-gray-700 truncate">{thread.author?.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium md:hidden">{new Date(thread.createdAt).toLocaleDateString('id-ID')}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Statistik Mobile Version */}
                                            <div className="md:hidden flex gap-4 text-center">
                                                <div className="text-[10px] font-bold text-gray-500">
                                                    <span className="text-gray-900 block">{thread.posts.length}</span>
                                                    <span>Balasan</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-500">
                                                    <span className="text-gray-900 block">{thread.views}</span>
                                                    <span>View</span>
                                                </div>
                                            </div>
                                            
                                            <div className="hidden md:flex items-center text-xs text-gray-400 font-medium">
                                                <span className="mx-2">•</span>
                                                <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                                                <span>{new Date(thread.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Desktop Statistics */}
                                    <div className="hidden md:flex gap-8 text-center text-sm border-l border-gray-50 pl-8 h-12 items-center">
                                        <div>
                                            <p className="font-black text-gray-900 text-lg leading-none">{thread.posts.length}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Balasan</p>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg leading-none">{thread.views}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dilihat</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                            <ForumIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 font-bold">Tidak ada diskusi ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>

            <NewThreadModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddThread={() => { fetchThreads(); setIsModalOpen(false); }} 
            />
        </div>
    );
};

export default ForumPage;
