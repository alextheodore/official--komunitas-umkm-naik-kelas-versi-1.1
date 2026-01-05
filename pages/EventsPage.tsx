
import React, { useState, useMemo, useEffect } from 'react';
import type { Event } from '../types';
import EventCard from '../components/EventCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { SparklesIcon } from '../components/icons';
import { supabase } from '../lib/supabase';

// Exported for Breadcrumbs and SearchModal compatibility
export const allEventsData: Event[] = [
    { id: '1', date: '2024-07-25', title: 'Digital Marketing 101 untuk UMKM', description: 'Pelajari dasar-dasar pemasaran digital.', image: 'https://picsum.photos/seed/event1/400/300', category: 'Webinar' },
    { id: '2', date: '2024-08-10', title: 'Workshop Manajemen Keuangan', description: 'Kelola keuangan bisnis Anda dengan efektif.', image: 'https://picsum.photos/seed/event2/400/300', category: 'Workshop' },
    { id: '3', date: '2024-08-18', title: 'Sesi Networking Bulanan', description: 'Bertemu and berkenalan dengan anggota.', image: 'https://picsum.photos/seed/event3/400/300', category: 'Networking' },
];

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Event['category'] | 'Semua'>('Semua');
    const categories: (Event['category'] | 'Semua')[] = ['Semua', 'Webinar', 'Workshop', 'Networking', 'Kompetisi'];

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;
            if (data) setEvents(data);
        } catch (err) {
            console.error("Gagal memuat event:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        document.title = 'Event & Pelatihan - Komunitas UMKM Naik Kelas';
    }, []);

    const filteredEvents = useMemo(() => {
        if (selectedCategory === 'Semua') return events;
        return events.filter(event => event.category === selectedCategory);
    }, [selectedCategory, events]);

    const upcomingEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return events
            .filter(event => new Date(event.date) >= today)
            .slice(0, 3);
    }, [events]);

    return (
        <div className="bg-white">
            <section className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Event & Pelatihan</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Tingkatkan wawasan, perluas jaringan, dan kembangkan bisnis Anda bersama kami.
                    </p>
                </div>
            </section>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {!loading && upcomingEvents.length > 0 && selectedCategory === 'Semua' && (
                    <div className="mb-16">
                        <div className="flex items-center mb-6">
                            <SparklesIcon className="h-6 w-6 text-yellow-500 mr-2" />
                            <h2 className="text-2xl font-bold text-gray-900">Event Mendatang</h2>
                        </div>
                        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                        <div className="mt-8 border-b border-gray-200"></div>
                    </div>
                )}

                <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
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

                {loading ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-gray-800">Tidak Ada Event</h2>
                        <p className="mt-2 text-gray-600">
                            Saat ini tidak ada event yang tersedia untuk kategori "{selectedCategory}".
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
