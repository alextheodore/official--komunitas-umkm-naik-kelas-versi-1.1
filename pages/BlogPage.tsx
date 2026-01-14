
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { supabase } from '../lib/supabase';

const ARTICLES_PER_PAGE = 6;

const getPaginationItems = (currentPage: number, totalPages: number): (number | '...')[] => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [];
    const shownPages = new Set<number>();
    shownPages.add(1);
    shownPages.add(totalPages);
    shownPages.add(currentPage);
    if (currentPage > 1) shownPages.add(currentPage - 1);
    if (currentPage < totalPages) shownPages.add(currentPage + 1);
    const sortedPages = Array.from(shownPages).sort((a, b) => a - b);
    let lastPage: number | null = null;
    for (const page of sortedPages) {
        if (lastPage !== null && page - lastPage > 1) pages.push('...');
        pages.push(page);
        lastPage = page;
    }
    return pages;
};

const BlogPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const contentRef = useRef<HTMLDivElement>(null);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            
            if (data) {
                setArticles(data.map(a => ({
                    id: a.id,
                    category: a.category,
                    title: a.title,
                    summary: a.summary,
                    content: a.content,
                    author: a.author,
                    date: a.date,
                    image: a.image,
                    authorImage: a.author_image
                })));
            }
        } catch (err) {
            console.error("Gagal memuat artikel:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
        document.title = 'Berita & Artikel Bisnis - Komunitas UMKM Naik Kelas';
    }, []);

    useEffect(() => {
        if (contentRef.current && !loading) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage, loading]);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(articles.map(a => a.category))).filter(Boolean) as string[];
        return ['Semua', ...unique];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        if (selectedCategory === 'Semua') return articles;
        return articles.filter(article => article.category === selectedCategory);
    }, [selectedCategory, articles]);

    const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
    const paginatedArticles = filteredArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);
    
    return (
        <div className="bg-white">
            <section className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Berita & Artikel</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Dapatkan wawasan, tips, dan inspirasi terbaru untuk memajukan bisnis Anda.
                    </p>
                </div>
            </section>

            <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
                <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                                selectedCategory === category ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: ARTICLES_PER_PAGE }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : paginatedArticles.length > 0 ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-gray-800">Tidak Ada Artikel</h2>
                        <p className="text-gray-500 mt-2">Belum ada konten yang tersedia di kategori ini.</p>
                    </div>
                )}
                
                {totalPages > 1 && (
                    <nav className="mt-16 flex items-center justify-center">
                         <div className="flex rounded-md shadow-sm">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            {getPaginationItems(currentPage, totalPages).map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof item === 'number' && setCurrentPage(item)}
                                    className={`-ml-px px-4 py-2 border text-sm font-medium ${currentPage === item ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
