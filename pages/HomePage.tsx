
import React, { useState, useEffect } from 'react';
import type { Event, Article } from '../types';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, SparklesIcon } from '../components/icons';
import EventCard from '../components/EventCard';
import ArticleCard from '../components/ArticleCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { supabase } from '../lib/supabase';

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const totalSlides = 4;

    return (
        <section className="relative h-[90vh] min-h-[600px] flex flex-col justify-center overflow-hidden bg-gray-900">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                    alt="Background Hero" 
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Badge Forum */}
                <div className="inline-flex items-center px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8 animate-fade-in-up">
                    <span className="text-white font-bold tracking-widest text-sm uppercase">Forum Diskusi Aktif</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up [animation-delay:0.2s]">
                    Transformasi Digital <span className="text-accent">UMKM</span> <br /> Bersama Kami
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up [animation-delay:0.4s]">
                    Bertukar pikiran dan temukan solusi bersama para ahli dan sesama anggota komunitas UMKM Indonesia.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:0.6s]">
                    <Link 
                        to="/register" 
                        className="w-full sm:w-auto px-10 py-4 bg-accent hover:bg-accent-600 text-gray-900 font-extrabold rounded-full shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        Gabung Sekarang <span className="text-xl">→</span>
                    </Link>
                    <Link 
                        to="/programs" 
                        className="w-full sm:w-auto px-10 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full backdrop-blur-sm transition-all hover:bg-white/10"
                    >
                        Pelajari Program
                    </Link>
                </div>
            </div>

            {/* Bottom Stats Bar - Adjusted to Center */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                <div className="container mx-auto px-4 pb-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
                        <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
                            <div className="text-center md:text-left">
                                <p className="text-3xl font-black text-white leading-none">5.000+</p>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Anggota Terdaftar</p>
                            </div>
                            <div className="text-center md:text-left border-l border-white/10 pl-8 lg:pl-12">
                                <p className="text-3xl font-black text-white leading-none">100+</p>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Event Diadakan</p>
                            </div>
                            <div className="text-center md:text-left border-l border-white/10 pl-8 lg:pl-12">
                                <p className="text-3xl font-black text-white leading-none">1.200+</p>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Produk Lokal</p>
                            </div>
                        </div>

                        {/* Slider Controls - Also Centered or Balanced */}
                        <div className="flex items-center gap-6">
                            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90">
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center gap-4 bg-black/40 px-6 py-2.5 rounded-full border border-white/5 shadow-inner">
                                <span className="text-white font-bold text-sm tracking-widest">{currentSlide} / {totalSlides}</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-2 bg-accent rounded-full"></div>
                                    <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                                    <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                                    <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                                </div>
                            </div>

                            <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90">
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Yellow Progress Bar Bottom - Centered */}
                <div className="h-1.5 w-full bg-white/5 flex justify-center">
                    <div className="h-full w-2/3 bg-accent shadow-[0_0_10px_rgba(255,193,7,0.5)]"></div>
                </div>
            </div>
        </section>
    );
};

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
                        ...a,
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
            <BlogSection />
            <EventsSection />
            
            {/* Call to Action Section Bottom */}
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
