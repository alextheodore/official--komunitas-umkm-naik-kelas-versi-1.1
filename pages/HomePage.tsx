
import React, { useState, useEffect, useCallback } from 'react';
import type { Event, Article } from '../types';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, LogoIcon } from '../components/icons';
import EventCard from '../components/EventCard';
import ArticleCard from '../components/ArticleCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { supabase } from '../lib/supabase';

const heroSlides = [
    {
        id: 1,
        tag: "Forum Diskusi Aktif",
        title: <>Transformasi Digital <span className="text-accent">UMKM</span> Bersama Kami</>,
        description: "Bertukar pikiran dan temukan solusi bersama para ahli dan sesama anggota komunitas UMKM Indonesia.",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        ctaPrimary: { text: "Gabung Sekarang", link: "/register" },
        ctaSecondary: { text: "Pelajari Program", link: "/programs" }
    },
    {
        id: 2,
        tag: "Marketplace Lokal",
        title: <>Pamerkan Produk <span className="text-accent">Unggulan</span> Anda</>,
        description: "Jangkau pasar yang lebih luas melalui ekosistem marketplace eksklusif untuk anggota komunitas.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        ctaPrimary: { text: "Mulai Jualan", link: "/marketplace" },
        ctaSecondary: { text: "Lihat Produk", link: "/marketplace" }
    },
    {
        id: 3,
        tag: "Edukasi & Pelatihan",
        title: <>Tingkatkan <span className="text-accent">Skill</span> Bisnis Anda</>,
        description: "Ikuti berbagai webinar dan workshop eksklusif dari para praktisi bisnis berpengalaman.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        ctaPrimary: { text: "Cek Jadwal", link: "/events" },
        ctaSecondary: { text: "Daftar Webinar", link: "/events" }
    },
    {
        id: 4,
        tag: "Networking Luas",
        title: <>Koneksi <span className="text-accent">Strategis</span> Antar Pengusaha</>,
        description: "Bangun jaringan dengan investor, mentor, dan ribuan pelaku UMKM dari seluruh pelosok negeri.",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        ctaPrimary: { text: "Cari Relasi", link: "/forum" },
        ctaSecondary: { text: "Buka Diskusi", link: "/forum" }
    }
];

const HeroSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [counts, setCounts] = useState({ users: 0, events: 0, products: 0 });
    const totalSlides = heroSlides.length;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    // Auto-play effect
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [u, e, p] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('events').select('*', { count: 'exact', head: true }),
                    supabase.from('products').select('*', { count: 'exact', head: true })
                ]);
                setCounts({
                    users: u.count || 0,
                    events: e.count || 0,
                    products: p.count || 0
                });
            } catch (err) {
                console.error("Failed to fetch homepage stats", err);
            }
        };
        fetchCounts();
    }, []);

    const currentSlide = heroSlides[currentIndex];

    return (
        <section className="relative h-[90vh] min-h-[650px] flex flex-col justify-center overflow-hidden bg-gray-900 transition-all duration-700">
            {/* Background Layer with Crossfade-like effect */}
            <div className="absolute inset-0 z-0">
                <img 
                    key={currentSlide.image}
                    src={currentSlide.image} 
                    alt="Background Hero" 
                    className="w-full h-full object-cover opacity-40 animate-fade-in"
                    style={{ animationDuration: '1.2s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90"></div>
            </div>

            {/* Content Layer */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div key={`tag-${currentIndex}`} className="inline-flex items-center px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8 animate-fade-in-up">
                    <span className="text-white font-bold tracking-widest text-sm uppercase">{currentSlide.tag}</span>
                </div>

                <h1 key={`title-${currentIndex}`} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up [animation-delay:0.2s]">
                    {currentSlide.title}
                </h1>

                <p key={`desc-${currentIndex}`} className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up [animation-delay:0.4s]">
                    {currentSlide.description}
                </p>

                <div key={`actions-${currentIndex}`} className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:0.6s]">
                    <Link 
                        to={currentSlide.ctaPrimary.link} 
                        className="w-full sm:w-auto px-10 py-4 bg-accent hover:bg-accent-600 text-gray-900 font-extrabold rounded-full shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        {currentSlide.ctaPrimary.text} <span className="text-xl">→</span>
                    </Link>
                    <Link 
                        to={currentSlide.ctaSecondary.link} 
                        className="w-full sm:w-auto px-10 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full backdrop-blur-sm transition-all hover:bg-white/10"
                    >
                        {currentSlide.ctaSecondary.text}
                    </Link>
                </div>
            </div>

            {/* Bottom Info & Navigation Layer */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                <div className="container mx-auto px-4 pb-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
                        {/* Stats Info */}
                        <div className="flex flex-wrap justify-center gap-12 lg:gap-20 order-2 md:order-1">
                            <div className="text-center md:text-left">
                                <p className="text-3xl font-black text-white leading-none">{counts.users.toLocaleString('id-ID')}</p>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Anggota Terdaftar</p>
                            </div>
                            <div className="text-center md:text-left border-l border-white/10 pl-8 lg:pl-12">
                                <p className="text-3xl font-black text-white leading-none">{counts.events.toLocaleString('id-ID')}</p>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Event Diadakan</p>
                            </div>
                            <div className="text-center md:text-left border-l border-white/10 pl-8 lg:pl-12">
                                <p className="text-3xl font-black text-white leading-none">{counts.products.toLocaleString('id-ID')}</p>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Produk Lokal</p>
                            </div>
                        </div>

                        {/* Slider Controls */}
                        <div className="flex items-center gap-6 order-1 md:order-2">
                            <button 
                                onClick={prevSlide}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center gap-4 bg-black/40 px-6 py-2.5 rounded-full border border-white/5 shadow-inner">
                                <span className="text-white font-bold text-sm tracking-widest">{currentIndex + 1} / {totalSlides}</span>
                                <div className="flex gap-2">
                                    {heroSlides.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-accent' : 'w-2 bg-white/20'}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={nextSlide}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90"
                                aria-label="Next Slide"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Progress Bar (Manual Resetting) */}
                <div className="h-1.5 w-full bg-white/5 flex justify-center">
                    <div 
                        key={`progress-${currentIndex}`}
                        className="h-full bg-accent shadow-[0_0_10px_rgba(255,193,7,0.5)] animate-progress"
                        style={{ width: '66.6%', animationDuration: '6s' }}
                    ></div>
                </div>
            </div>
        </section>
    );
};

const AboutSection: React.FC = () => (
    <section id="about" className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="relative">
                    <div className="relative max-w-md mx-auto">
                        {/* Decorative background shape */}
                        <div className="absolute -top-4 -left-4 w-full h-full bg-primary-200 rounded-2xl transform rotate-3"></div>
                        
                        {/* The image with its own frame */}
                        <div className="relative bg-white p-2 rounded-2xl shadow-2xl border-2 border-gray-50">
                            <img 
                                src="https://picsum.photos/seed/ketua/500/600" 
                                alt="Ketua Komunitas UMKM Naik Kelas" 
                                className="w-full h-auto rounded-xl" 
                            />
                        </div>
                        
                        {/* Small logo-like element */}
                        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-primary-50">
                            <LogoIcon className="h-10 w-10 text-primary-500" />
                        </div>
                    </div>
                </div>
                <div>
                    <span className="text-primary-600 font-semibold uppercase tracking-wider">TENTANG KAMI</span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">Misi Kami Adalah Memberdayakan UMKM Indonesia</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        Kami percaya bahwa UMKM adalah tulang punggung ekonomi Indonesia. Visi kami adalah menciptakan ekosistem digital yang solid di mana setiap UMKM memiliki kesempatan yang sama untuk belajar, berkolaborasi, dan bertumbuh secara berkelanjutan.
                    </p>
                    <ul className="mt-6 space-y-4">
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 font-bold">✓</span>
                            <span className="text-gray-700">Menyediakan platform untuk networking dan berbagi pengetahuan.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 font-bold">✓</span>
                            <span className="text-gray-700">Mengadakan event dan pelatihan berkualitas untuk peningkatan kapasitas.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 font-bold">✓</span>
                            <span className="text-gray-700">Membuka akses pasar yang lebih luas melalui marketplace komunitas.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const BlogSection: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestArticles = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(3);
                if (data) {
                    setArticles(data.map((a: any) => ({
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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestArticles();
    }, []);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-12 bg-primary-600 rounded-full"></div>
                            <span className="text-primary-600 font-bold uppercase tracking-widest text-sm">Update Terkini</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Insight Bisnis Untuk Anda</h2>
                    </div>
                    <Link to="/blog" className="px-6 py-2.5 bg-primary-50 text-primary-700 font-bold rounded-xl hover:bg-primary-100 transition-all flex items-center gap-2">
                        Semua Artikel <span>→</span>
                    </Link>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : 
                     articles.map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
            </div>
        </section>
    );
};

const EventsSection: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestEvents = async () => {
            setLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const { data } = await supabase
                    .from('events')
                    .select('*')
                    .gte('date', today)
                    .order('date', { ascending: true })
                    .limit(3);
                if (data) setEvents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestEvents();
    }, []);

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full mb-4">
                        <SparklesIcon className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Belajar Bersama</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Agenda Komunitas Mendatang</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Ikuti berbagai program pelatihan dan networking yang dirancang khusus untuk pertumbuhan bisnis Anda.
                    </p>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : 
                     events.length > 0 ? events.map(e => <EventCard key={e.id} event={e} />) : 
                     <div className="col-span-full text-center text-gray-400 py-10">Belum ada agenda terdekat.</div>}
                </div>
                <div className="mt-16 text-center">
                    <Link to="/events" className="inline-flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700 underline underline-offset-8 decoration-2">
                        Lihat Jadwal Selengkapnya
                    </Link>
                </div>
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <AboutSection />
            <BlogSection />
            <EventsSection />
            
            <section className="py-20 bg-primary-600">
                <div className="container mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">Siap Menjadikan UMKM Anda Naik Kelas?</h2>
                    <p className="text-primary-100 mb-10 max-w-xl mx-auto text-lg font-medium">
                        Bergabunglah dengan ribuan pengusaha lainnya dan nikmati akses eksklusif ke pasar serta pengetahuan bisnis.
                    </p>
                    <Link to="/register" className="px-12 py-5 bg-white text-primary-700 font-black rounded-full hover:bg-gray-100 transition-all shadow-xl hover:scale-105 inline-block">
                        Daftar Menjadi Anggota
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
