
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Article } from '../types';
import { CalendarIcon, FacebookIcon, WhatsAppIcon, LinkIcon, CheckCircleIcon, ExclamationCircleIcon } from '../components/icons';
import ArticleCard from '../components/ArticleCard';
import DetailPageSkeleton from '../components/skeletons/DetailPageSkeleton';

// Share Buttons Component
const ShareButtons: React.FC<{ url: string; title: string; summary: string }> = ({ url, title, summary }) => {
    const [copied, setCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800">Bagikan Artikel Ini</h3>
            <div className="mt-4 flex justify-center items-center space-x-4">
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                    <FacebookIcon className="h-6 w-6" />
                </a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white transition-colors">
                    <WhatsAppIcon className="h-6 w-6" />
                </a>
                <button onClick={handleCopy} className="relative p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-700 hover:text-white transition-colors">
                    {copied ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> : <LinkIcon className="h-6 w-6" />}
                </button>
            </div>
        </div>
    );
};


const ArticleDetailPage: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticleData = async () => {
            if (!articleId) return;
            
            setLoading(true);
            setError(null);
            
            try {
                // Fetch main article
                const { data, error: fetchError } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId)
                    .maybeSingle();

                if (fetchError) throw fetchError;

                if (data) {
                    const mapped: Article = {
                        id: data.id,
                        category: data.category || 'Berita',
                        title: data.title || 'Tanpa Judul',
                        summary: data.summary || '',
                        content: data.content || '',
                        author: data.author || 'Admin',
                        date: data.date || data.created_at,
                        image: data.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                        authorImage: data.author_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.author || 'Admin')}`
                    };
                    setArticle(mapped);
                    document.title = `${mapped.title} | UMKM Naik Kelas`;

                    // Fetch related articles
                    const { data: relatedData } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('category', mapped.category)
                        .neq('id', mapped.id)
                        .limit(3);
                    
                    if (relatedData) {
                        setRelatedArticles(relatedData.map((r: any) => ({
                            id: r.id,
                            category: r.category,
                            title: r.title,
                            summary: r.summary,
                            content: r.content,
                            author: r.author,
                            date: r.date,
                            image: r.image,
                            authorImage: r.author_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author || 'Admin')}`
                        })));
                    }
                } else {
                    setArticle(null);
                }
            } catch (err: any) {
                console.error("Gagal ambil detail artikel:", err);
                setError("Terjadi kesalahan saat memuat artikel.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticleData();
    }, [articleId]);

    if (loading) return <DetailPageSkeleton />;

    if (error || !article) {
        return (
            <div className="text-center py-32 bg-gray-50 min-h-screen flex flex-col items-center">
                <ExclamationCircleIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                    {error ? "Terjadi Kesalahan" : "Artikel tidak ditemukan"}
                </h1>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                    Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus dari database.
                </p>
                <Link to="/blog" className="mt-8 inline-block px-8 py-3 text-white bg-primary-600 rounded-full font-bold hover:bg-primary-700 transition-all shadow-lg">
                    Kembali ke Blog
                </Link>
            </div>
        );
    }

    const formattedDate = new Date(article.date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <Link to="/blog" className="text-sm font-bold text-primary-600 uppercase hover:underline tracking-widest">{article.category}</Link>
                        <h1 className="mt-4 text-3xl md:text-5xl font-black text-gray-900 leading-tight">{article.title}</h1>
                        <div className="mt-8 flex justify-center items-center space-x-6 text-gray-500">
                            <div className="flex items-center space-x-3">
                                <img src={article.authorImage} alt={article.author} className="h-10 w-10 rounded-full border-2 border-primary-50 object-cover" />
                                <span className="font-bold text-gray-700">{article.author}</span>
                            </div>
                            <span className="hidden sm:block text-gray-200">|</span>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm">{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="my-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                        <img src={article.image} alt={article.title} className="w-full h-auto object-cover max-h-[550px]" />
                    </div>

                    <article className="prose prose-lg lg:prose-xl max-w-none mx-auto text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                        {article.content}
                    </article>

                    <div className="mt-16 pt-10 border-t border-gray-100">
                        <ShareButtons
                            url={window.location.href}
                            title={article.title}
                            summary={article.summary}
                        />
                    </div>
                </div>
            </div>
            
            {relatedArticles.length > 0 && (
                <section className="bg-gray-50 py-20 mt-12 border-t border-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-10">Baca Artikel Terkait</h2>
                            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedArticles.map(related => <ArticleCard key={related.id} article={related} />)}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ArticleDetailPage;
