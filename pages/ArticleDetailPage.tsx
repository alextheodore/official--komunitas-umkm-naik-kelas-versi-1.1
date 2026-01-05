
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Article } from '../types';
import { CalendarIcon, FacebookIcon, TwitterIcon, LinkedInIcon, WhatsAppIcon, LinkIcon, CheckCircleIcon } from '../components/icons';
import ArticleCard from '../components/ArticleCard';
import DetailPageSkeleton from '../components/skeletons/DetailPageSkeleton';

// Share Buttons Component
const ShareButtons: React.FC<{ url: string; title: string; summary: string }> = ({ url, title, summary }) => {
    const [copied, setCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedSummary = encodeURIComponent(summary);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`,
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

    useEffect(() => {
        const fetchArticleData = async () => {
            setLoading(true);
            try {
                // Fetch main article
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId)
                    .single();

                if (error) throw error;

                if (data) {
                    const mapped: Article = {
                        id: data.id,
                        category: data.category,
                        title: data.title,
                        summary: data.summary,
                        content: data.content,
                        author: data.author,
                        date: data.date,
                        image: data.image,
                        authorImage: data.author_image
                    };
                    setArticle(mapped);
                    
                    // SEO
                    document.title = `${mapped.title} | UMKM Naik Kelas`;

                    // Fetch related articles
                    const { data: relatedData } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('category', data.category)
                        .neq('id', data.id)
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
                            authorImage: r.author_image
                        })));
                    }
                }
            } catch (err) {
                console.error("Gagal ambil detail artikel:", err);
            } finally {
                setLoading(false);
            }
        };

        if (articleId) fetchArticleData();
    }, [articleId]);

    if (loading) return <DetailPageSkeleton />;

    if (!article) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-800">Artikel tidak ditemukan</h1>
                <Link to="/blog" className="mt-6 inline-block px-6 py-3 text-white bg-primary-600 rounded-full hover:bg-primary-700">
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
                        <Link to="/blog" className="text-sm font-semibold text-primary-600 uppercase hover:underline">{article.category}</Link>
                        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">{article.title}</h1>
                        <div className="mt-6 flex justify-center items-center space-x-6 text-gray-500">
                            <div className="flex items-center space-x-2">
                                <img src={article.authorImage} alt={article.author} className="h-10 w-10 rounded-full border" />
                                <span>{article.author}</span>
                            </div>
                            <span className="hidden sm:block">|</span>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border">
                        <img src={article.image} alt={article.title} className="w-full h-auto object-cover max-h-[500px]" />
                    </div>

                    <article className="prose lg:prose-xl max-w-none mx-auto text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {article.content}
                    </article>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <ShareButtons
                            url={window.location.href}
                            title={article.title}
                            summary={article.summary}
                        />
                    </div>
                </div>
            </div>
            
            {relatedArticles.length > 0 && (
                <section className="bg-gray-50 py-16 mt-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Artikel Terkait Lainnya</h2>
                        <div className="max-w-5xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedArticles.map(related => <ArticleCard key={related.id} article={related} />)}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ArticleDetailPage;
