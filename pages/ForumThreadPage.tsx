
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { ForumThread, ForumPost } from '../types';
import ForumThreadSkeleton from '../components/skeletons/ForumThreadSkeleton';
import VoteControl from '../components/VoteControl';
import FollowButton from '../components/FollowButton';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SpinnerIcon, SparklesIcon, ChatBotIcon } from '../components/icons';
import { GoogleGenAI } from '@google/genai';

const PostCard: React.FC<{ post: ForumPost, isOP?: boolean }> = ({ post, isOP = false }) => {
    const { currentUser } = useAuth();
    
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return Math.floor(seconds) + " detik lalu";
    };

    return (
        <div className={`flex space-x-4 ${!isOP ? 'pt-8 border-t border-gray-100' : ''}`} id={`post-${post.id}`}>
            <div className="flex-shrink-0 flex flex-col items-center">
                <img 
                    src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'User')}`} 
                    alt={post.author?.name} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary-50 shadow-sm" 
                />
                {isOP && <span className="mt-2 text-[10px] font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Penulis</span>}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                         <div>
                            <p className="font-bold text-gray-900">{post.author?.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{post.author?.businessName}</p>
                        </div>
                        {post.author && currentUser && currentUser.id !== post.author.id && <FollowButton userId={post.author.id} />}
                    </div>
                    <p className="text-xs text-gray-400 font-mono">{timeAgo(post.timestamp)}</p>
                </div>
                <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {post.content}
                </div>
                <div className="mt-6 flex items-center space-x-6">
                    <VoteControl 
                        initialUpvotes={post.upvotes} 
                        initialDownvotes={post.downvotes} 
                        direction="row" 
                    />
                    <button className="text-sm font-bold text-primary-600 hover:underline">
                        Balas
                    </button>
                </div>
            </div>
        </div>
    );
};

const ForumThreadPage: React.FC = () => {
    const { threadId } = useParams<{ threadId: string }>();
    const [thread, setThread] = useState<ForumThread | null>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const { currentUser } = useAuth();

    const fetchThreadData = async () => {
        if (!threadId) return;
        try {
            const { data: tData, error: tError } = await supabase
                .from('forum_threads')
                .select('*, profiles:author_id(*)')
                .eq('id', threadId)
                .single();

            if (tError) throw tError;

            const { data: pData, error: pError } = await supabase
                .from('forum_posts')
                .select('*, profiles:author_id(*)')
                .eq('thread_id', threadId)
                .order('created_at', { ascending: true });

            if (pError) throw pError;

            const mappedPosts: ForumPost[] = pData.map(p => ({
                id: p.id,
                author_id: p.author_id,
                content: p.content,
                timestamp: p.created_at,
                upvotes: p.upvotes || 0,
                downvotes: p.downvotes || 0,
                author: {
                    id: p.profiles.id,
                    name: p.profiles.full_name,
                    profilePicture: p.profiles.avatar_url,
                    businessName: p.profiles.business_name
                }
            }));

            setThread({
                id: tData.id,
                title: tData.title,
                category: tData.category,
                author_id: tData.author_id,
                createdAt: tData.created_at,
                views: tData.views || 0,
                upvotes: tData.upvotes || 0,
                downvotes: tData.downvotes || 0,
                posts: mappedPosts,
                author: {
                    id: tData.profiles.id,
                    name: tData.profiles.full_name,
                    profilePicture: tData.profiles.avatar_url,
                    businessName: tData.profiles.business_name
                }
            });
            
            await supabase.from('forum_threads').update({ views: (tData.views || 0) + 1 }).eq('id', threadId);

        } catch (err) {
            console.error("Gagal ambil diskusi:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAiInsight = async () => {
        if (!thread || isGeneratingAi) return;
        setIsGeneratingAi(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const allContent = thread.posts.map(p => `${p.author?.name}: ${p.content}`).join('\n\n');
            const prompt = `Analisis diskusi forum UMKM berikut dengan judul "${thread.title}". 
            Isi diskusi:\n${allContent}\n\n
            Berikan: 
            1. Ringkasan singkat diskusi.
            2. Solusi atau jawaban terbaik berdasarkan poin-poin yang dibahas.
            3. 3 Tips tambahan dari perspektif ahli bisnis untuk membantu pengusaha ini.
            Gunakan format Markdown yang rapi dengan bullet points. Berikan dalam Bahasa Indonesia yang profesional.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });

            setAiInsight(response.text || "Gagal mendapatkan insight.");
        } catch (err) {
            alert("Maaf, AI sedang sibuk. Silakan coba lagi nanti.");
        } finally {
            setIsGeneratingAi(false);
        }
    };

    useEffect(() => {
        fetchThreadData();
    }, [threadId]);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !threadId || !reply.trim()) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('forum_posts')
                .insert({
                    thread_id: threadId,
                    author_id: currentUser.id,
                    content: reply,
                    upvotes: 0,
                    downvotes: 0
                });

            if (error) throw error;
            
            setReply('');
            await fetchThreadData();
        } catch (err) {
            alert("Gagal mengirim balasan.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <ForumThreadSkeleton />;
    if (!thread) return <div className="text-center py-20">Diskusi tidak ditemukan.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold uppercase mb-3 border border-primary-100">{thread.category}</span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{thread.title}</h1>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                            <div className="text-center">
                                <p className="text-gray-900 font-bold">{thread.posts.length}</p>
                                <p>Balasan</p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-900 font-bold">{thread.views}</p>
                                <p>Dilihat</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Insight Section */}
                    <div className="mb-8 overflow-hidden rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm transition-all duration-500">
                        <div className="bg-gradient-to-r from-indigo-600 to-primary-600 px-6 py-3 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5" />
                                <span className="font-bold text-sm uppercase tracking-wider">Bantuan Mentor AI</span>
                            </div>
                            {!aiInsight && !isGeneratingAi && (
                                <button 
                                    onClick={handleGenerateAiInsight}
                                    className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm transition-all"
                                >
                                    Minta Insight AI
                                </button>
                            )}
                        </div>
                        <div className="p-6">
                            {isGeneratingAi ? (
                                <div className="flex flex-col items-center py-6 gap-3">
                                    <SpinnerIcon className="h-8 w-8 animate-spin text-primary-600" />
                                    <p className="text-sm font-bold text-gray-500 animate-pulse uppercase tracking-widest">Menganalisis diskusi...</p>
                                </div>
                            ) : aiInsight ? (
                                <div className="prose prose-indigo prose-sm max-w-none text-gray-700 animate-fade-in-up whitespace-pre-wrap leading-relaxed">
                                    {aiInsight}
                                    <div className="mt-4 pt-4 border-t border-indigo-50 flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase">
                                        <ChatBotIcon className="h-3 w-3" /> Jawaban didukung oleh Gemini 3 Pro
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-sm">Butuh bantuan pakar? AI kami dapat merangkum diskusi ini dan memberikan saran bisnis profesional untuk Anda.</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-10">
                        {thread.posts.map((p, idx) => <PostCard key={p.id} post={p} isOP={idx === 0} />)}
                    </div>

                    {currentUser ? (
                        <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                Tulis Balasan
                            </h3>
                            <form onSubmit={handleReplySubmit} className="space-y-4">
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Bagikan pemikiran atau bantuan Anda..."
                                    rows={5}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm shadow-inner"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !reply.trim()}
                                        className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-100 disabled:bg-gray-300 transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting ? <SpinnerIcon className="animate-spin h-5 w-5" /> : 'Kirim Balasan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="mt-8 bg-primary-50 p-8 rounded-2xl text-center border border-primary-100">
                            <p className="text-primary-800 font-bold mb-4">Ingin ikut berdiskusi?</p>
                            <Link to="/login" className="inline-block px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all">Login Sekarang</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumThreadPage;
