
import React, { useState, useEffect } from 'react';
import type { Feature, Event, Article, Benefit, Testimonial } from '../types';
import { NetworkingIcon, LearningIcon, CollaborationIcon, ForumIcon, MarketplaceIcon } from '../components/icons';
import { supabase } from '../lib/supabase';

import FeatureCard from '../components/FeatureCard';
import BenefitCard from '../components/BenefitCard';
import TestimonialCard from '../components/TestimonialCard';
import EventCard from '../components/EventCard';
import ArticleCard from '../components/ArticleCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';

// --- Static Mock Data for UI/Styling Elements ---
const featuresData: Feature[] = [
  { icon: <ForumIcon className="h-8 w-8 text-white" />, title: 'Forum Diskusi', description: 'Tempat berbagi ide, bertanya, dan berdiskusi.' },
  { icon: <LearningIcon className="h-8 w-8 text-white" />, title: 'Event & Pelatihan', description: 'Ikuti webinar & workshop untuk tingkatkan kompetensi.' },
  { icon: <MarketplaceIcon className="h-8 w-8 text-white" />, title: 'Marketplace', description: 'Pamerkan dan jual produk Anda ke seluruh anggota.' },
];

const benefitsData: Benefit[] = [
    { icon: <NetworkingIcon className="h-10 w-10 text-primary-600" />, title: 'Networking Luas', description: 'Terhubung dengan para pelaku UMKM, mentor, dan investor.' },
    { icon: <LearningIcon className="h-10 w-10 text-primary-600" />, title: 'Belajar & Bertumbuh', description: 'Ikuti pelatihan, webinar, dan workshop eksklusif.' },
    { icon: <CollaborationIcon className="h-10 w-10 text-primary-600" />, title: 'Kolaborasi Bisnis', description: 'Temukan mitra bisnis potensial dan ciptakan peluang baru.' },
];

const testimonialsData: Testimonial[] = [
    {
        quote: "Jaringannya luar biasa and event-eventnya sangat bermanfaat!",
        author: "Budi Santoso",
        role: "Pemilik Kedai Kopi Maju",
        image: "https://picsum.photos/seed/testi1/100/100"
    },
    {
        quote: "Melalui marketplace komunitas, penjualan saya meningkat 50% dalam 3 bulan.",
        author: "Rina Susanti",
        role: "Pengrajin Tas Kulit",
        image: "https://picsum.photos/seed/testi2/100/100"
    },
    {
        quote: "Workshop digital marketing yang saya ikuti sangat membuka wawasan.",
        author: "Andi Pratama",
        role: "Founder UMKM Fashion",
        image: "https://picsum.photos/seed/testi3/100/100"
    }
];

// --- Helper Section Component ---
const CardSection: React.FC<{ title: string; children: React.ReactNode; gridCols?: string }> = ({ title, children, gridCols = 'md:grid-cols-2 lg:grid-cols-3' }) => (
    <section className="mb-20">
        <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h2>
            <div className="h-px bg-gray-200 flex-grow"></div>
        </div>
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
            {children}
        </div>
    </section>
);

// --- Main Page Component ---
const AllCardsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveData = async () => {
            setLoading(true);
            try {
                const [eventRes, articleRes] = await Promise.all([
                    supabase.from('events').select('*').limit(3),
                    supabase.from('articles').select('*').limit(3)
                ]);

                if (eventRes.data) setEvents(eventRes.data);
                if (articleRes.data) {
                    setArticles(articleRes.data.map((a: any) => ({
                        ...a,
                        authorImage: a.author_image
                    })));
                }
            } catch (err) {
                console.error("Gagal muat data kartu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveData();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">Katalog Komponen UI</h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        Representasi visual dari berbagai kartu data yang terhubung langsung ke database Supabase.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto">
                    <CardSection title="Benefit Cards" gridCols="md:grid-cols-3">
                       {benefitsData.map((item, index) => <BenefitCard key={index} benefit={item} />)}
                    </CardSection>
                    
                    <CardSection title="Feature Cards" gridCols="md:grid-cols-3">
                        {featuresData.map((item, index) => <FeatureCard key={index} feature={item} />)}
                    </CardSection>

                    <CardSection title="Testimonial Cards" gridCols="md:grid-cols-3">
                        {testimonialsData.map((item, index) => <TestimonialCard key={index} testimonial={item} />)}
                    </CardSection>

                    <CardSection title="Live Event Cards (dari Supabase)" gridCols="md:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
                        ) : events.length > 0 ? (
                            events.map((item) => <EventCard key={item.id} event={item} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-400 py-10 bg-white rounded-xl border border-dashed border-gray-200">Tidak ada data event di database.</p>
                        )}
                    </CardSection>

                    <CardSection title="Live Article Cards (dari Supabase)" gridCols="md:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
                        ) : articles.length > 0 ? (
                            articles.map((item) => <ArticleCard key={item.id} article={item} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-400 py-10 bg-white rounded-xl border border-dashed border-gray-200">Tidak ada data artikel di database.</p>
                        )}
                    </CardSection>
                </div>
            </div>
        </div>
    );
};

export default AllCardsPage;
