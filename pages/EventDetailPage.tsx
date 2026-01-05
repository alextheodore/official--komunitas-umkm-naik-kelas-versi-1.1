
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Event } from '../types';
import { CalendarIcon, CheckCircleIcon, SpinnerIcon } from '../components/icons';
import DetailPageSkeleton from '../components/skeletons/DetailPageSkeleton';
import EventCard from '../components/EventCard';
import { supabase } from '../lib/supabase';

const RegistrationForm: React.FC<{ event: Event }> = ({ event }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [errors, setErrors] = useState({ name: '', email: '', phone: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = { name: '', email: '', phone: '' };
        let isValid = true;
        if (!formData.name.trim()) { newErrors.name = 'Nama lengkap wajib diisi.'; isValid = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Format email tidak valid.'; isValid = false; }
        if (!/^08[0-9]{8,11}$/.test(formData.phone)) { newErrors.phone = 'Nomor telepon tidak valid.'; isValid = false; }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        // Simulasi pendaftaran
        setTimeout(() => {
            setIsSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="border border-green-200 bg-green-50 p-6 rounded-lg">
                <div className="flex items-start">
                    <CheckCircleIcon className="h-8 w-8 text-green-500 flex-shrink-0 mr-4" />
                    <div>
                        <h4 className="text-lg font-bold text-green-800">Pendaftaran Berhasil!</h4>
                        <p className="text-green-700 mt-1">Konfirmasi telah dikirim ke email <span className="font-semibold">{formData.email}</span>.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} required />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} required />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} required />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 disabled:bg-primary-400 flex items-center justify-center transition-colors">
                {isSubmitting ? <SpinnerIcon className="animate-spin h-5 w-5 mr-2" /> : 'Daftar Sekarang'}
            </button>
        </form>
    );
};


const EventDetailPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventData = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', eventId)
                    .single();

                if (error) throw error;
                if (data) {
                    setEvent(data);
                    document.title = `${data.title} - Event UMKM`;

                    const { data: related } = await supabase
                        .from('events')
                        .select('*')
                        .eq('category', data.category)
                        .neq('id', data.id)
                        .limit(3);
                    
                    if (related) setRelatedEvents(related);
                }
            } catch (err) {
                console.error("Gagal ambil detail event:", err);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) fetchEventData();
    }, [eventId]);

    if (loading) return <DetailPageSkeleton />;

    if (!event) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-800">Event tidak ditemukan</h1>
                <Link to="/events" className="mt-6 inline-block px-6 py-3 text-white bg-primary-600 rounded-full hover:bg-primary-700">
                    Kembali ke Halaman Event
                </Link>
            </div>
        );
    }
    
    const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2">
                        <div className="rounded-lg overflow-hidden shadow-lg mb-8">
                            <img src={event.image} alt={event.title} className="w-full h-auto object-cover max-h-[500px]" />
                        </div>
                        <span className="text-sm font-semibold text-primary-600 uppercase">{event.category}</span>
                        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">{event.title}</h1>
                        <div className="mt-4 flex items-center space-x-2 text-gray-600">
                            <CalendarIcon className="h-5 w-5" />
                            <span className="font-semibold">{formattedDate}</span>
                        </div>
                        <article className="prose lg:prose-lg max-w-none mt-6 text-gray-700 whitespace-pre-wrap">
                            {event.description}
                        </article>
                    </div>

                    <aside className="lg:sticky top-24">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Ikuti Event Ini</h3>
                            <RegistrationForm event={event} />
                        </div>
                    </aside>
                </div>
            </div>

            {relatedEvents.length > 0 && (
                <section className="bg-gray-50 py-16 mt-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Agenda Serupa</h2>
                        <div className="max-w-5xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedEvents.map(related => <EventCard key={related.id} event={related} />)}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default EventDetailPage;
