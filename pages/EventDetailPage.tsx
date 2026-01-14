
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Event } from '../types';
import { CalendarIcon, CheckCircleIcon, SpinnerIcon, ExclamationCircleIcon } from '../components/icons';
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
            if (!eventId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', eventId)
                    .maybeSingle();

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

        fetchEventData();
    }, [eventId]);

    if (loading) return <DetailPageSkeleton />;

    if (!event) {
        return (
            <div className="text-center py-32 bg-gray-50 min-h-screen">
                <ExclamationCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h1 className="text-3xl font-extrabold text-gray-800">Event tidak ditemukan</h1>
                <p className="mt-2 text-gray-500">Mungkin link acara sudah kadaluwarsa atau event telah dihapus.</p>
                <Link to="/events" className="mt-8 inline-block px-8 py-3 text-white bg-primary-600 rounded-full font-bold hover:bg-primary-700 shadow-lg">
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
                        <div className="rounded-2xl overflow-hidden shadow-xl mb-8 border border-gray-100">
                            <img src={event.image} alt={event.title} className="w-full h-auto object-cover max-h-[550px]" />
                        </div>
                        <span className="text-sm font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-md">{event.category}</span>
                        <h1 className="mt-4 text-3xl md:text-4xl font-black text-gray-900 leading-tight">{event.title}</h1>
                        <div className="mt-4 flex items-center space-x-2 text-gray-500 font-medium">
                            <CalendarIcon className="h-5 w-5" />
                            <span>{formattedDate}</span>
                        </div>
                        <article className="prose lg:prose-lg max-w-none mt-8 text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {event.description}
                        </article>
                    </div>

                    <aside className="lg:sticky top-24">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Reservasi Kehadiran</h3>
                            <RegistrationForm event={event} />
                        </div>
                    </aside>
                </div>
            </div>

            {relatedEvents.length > 0 && (
                <section className="bg-gray-50 py-20 mt-12 border-t border-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-10 text-center">Agenda Serupa</h2>
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
