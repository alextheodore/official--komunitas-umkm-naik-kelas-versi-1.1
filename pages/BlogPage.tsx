
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { ChevronLeftIcon, ChevronRightIcon, SpinnerIcon } from '../components/icons';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { supabase } from '../lib/supabase';

// Added allArticlesData export to resolve missing export errors in Breadcrumbs and SearchModal
export const allArticlesData: Article[] = [
    { 
        id: '1', 
        category: 'Tips Bisnis', 
        title: '5 Cara Efektif Mengelola Stok Barang', 
        summary: 'Manajemen stok yang baik adalah kunci efisiensi. Pelajari lima strategi praktis.', 
        content: 'Manajemen stok yang baik adalah kunci efisiensi. Pelajari lima strategi praktis untuk mengoptimalkan persediaan. Dalam artikel ini, kita akan membahas pentingnya inventory turnover, metode FIFO and LIFO, serta penggunaan software untuk mempermudah pengelolaan stok.', 
        author: 'Andi Pratama', 
        date: '2024-07-20', 
        image: 'https://picsum.photos/seed/blog1/400/250', 
        authorImage: 'https://picsum.photos/seed/author1/40/40' 
    },
    { 
        id: '2', 
        category: 'Kolaborasi', 
        title: 'Kisah Sukses Kolaborasi Antar Anggota', 
        summary: 'Lihat bagaimana dua anggota berhasil menggabungkan kekuatan mereka.', 
        content: 'Kolaborasi adalah kunci pertumbuhan di era modern. Artikel ini menceritakan kisah sukses antara pengrajin tas kulit and desainer pakaian dalam menciptakan lini produk fashion yang unik.', 
        author: 'Siti Aminah', 
        date: '2024-07-18', 
        image: 'https://picsum.photos/seed/blog2/400/250', 
        authorImage: 'https://picsum.photos/seed/author2/40/40' 
    },
    { 
        id: '3', 
        category: 'UMKM', 
        title: 'Pentingnya Branding untuk Produk', 
        summary: 'Branding bukan hanya logo. Pahami cara membangun identitas merek yang kuat.', 
        content: 'Branding yang kuat dapat membedakan produk Anda dari kompetitor and membangun loyalitas pelanggan. Topik ini akan membahas elemen-elemen penting dalam branding, mulai dari menentukan target audiens, merancang identitas visual, hingga membangun narasi merek yang menarik.', 
        author: 'Budi Santoso', 
        date: '2024-07-15', 
        image: 'https://picsum.photos/seed/blog3/400/250', 
        authorImage: 'https://picsum.photos/seed/author3/40/40' 
    },
];

const ARTICLES_PER_PAGE = 6;

// Helper function to generate pagination items
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
    if (currentPage < 5) { shownPages.add(2); shownPages.add(3); }
    if (currentPage > totalPages - 4) { shownPages.add(totalPages - 1); shownPages.add(totalPages - 2); }
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
                const mapped: Article[] = data.map(a => ({
                    id: a.id,
                    category: a.category,
                    title: a.title,
                    summary: a.summary,
                    content: a.content,
                    author: a.author,
                    date: a.date,
                    image: a.image,
                    authorImage: a.author_image
                }));
                setArticles(mapped);
            }
        } catch (err) {
            console.error("Gagal memuat artikel:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
        
        // SEO logic
        document.title = 'Berita & Artikel Bisnis - Komunitas UMKM Naik Kelas';
    }, []);

    // Scroll to top of content when page changes
    useEffect(() => {
        if (contentRef.current && !loading) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage, loading]);

    const categories = ['Semua', ...new Set(articles.map(a => a.category))];

    const filteredArticles = useMemo(() => {
        if (selectedCategory === 'Semua') return articles;
        return articles.filter(article => article.category === selectedCategory);
    }, [selectedCategory, articles]);

    const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
    const paginatedArticles = filteredArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);
    
    const startRange = (currentPage - 1) * ARTICLES_PER_PAGE + 1;
    const endRange = Math.min(currentPage * ARTICLES_PER_PAGE, filteredArticles.length);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

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
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                                selectedCategory === category
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {!loading && filteredArticles.length > 0 && (
                    <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
                        Menampilkan <span className="font-medium text-gray-800">{startRange}-{endRange}</span> dari <span className="font-medium text-gray-800">{filteredArticles.length}</span> artikel
                    </p>
                )}

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
                        <p className="mt-2 text-gray-600">
                            Saat ini tidak ada artikel yang tersedia untuk kategori "{selectedCategory}".
                        </p>
                    </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="mt-16 flex items-center justify-center" aria-label="Pagination">
                         <div className="flex rounded-md shadow-sm">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            
                            {getPaginationItems(currentPage, totalPages).map((item, index) =>
                                typeof item === 'number' ? (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(item)}
                                        className={`-ml-px relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            currentPage === item
                                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ) : (
                                    <span key={index} className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                )
                            )}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="-ml-px relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
