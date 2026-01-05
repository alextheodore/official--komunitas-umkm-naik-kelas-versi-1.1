
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Feature, Event, Article, Benefit, Testimonial } from '../types';
import { Link } from 'react-router-dom';
import { NetworkingIcon, LearningIcon, CollaborationIcon, ForumIcon, MarketplaceIcon, LogoIcon, UsersIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '../components/icons';
import EventCard from '../components/EventCard';
import ArticleCard from '../components/ArticleCard';
import FeatureCard from '../components/FeatureCard';
import BenefitCard from '../components/BenefitCard';
import TestimonialCard from '../components/TestimonialCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { supabase } from '../lib/supabase';

// Helper components logic assumed to be present

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
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-primary-600 font-semibold uppercase tracking-wider">BERITA & ARTIKEL</span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">Insight Terbaru dari Dunia Bisnis</h2>
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
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary-600 font-semibold uppercase tracking-wider">AGENDA KOMUNITAS</span>
                        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">Jangan Lewatkan Event & Pelatihan Mendatang</h2>
                    </div>
                    <Link to="/events" className="text-primary-600 font-bold hover:underline mb-2">Lihat Semua Event &rarr;</Link>
                </div>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />) : 
                     events.length > 0 ? events.map(e => <EventCard key={e.id} event={e} />) : 
                     <div className="col-span-full text-center text-gray-400 py-10">Belum ada agenda terdekat.</div>}
                </div>
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
    return (
        <>
            <BlogSection />
            <EventsSection />
        </>
    );
};

export default HomePage;
