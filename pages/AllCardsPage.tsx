
import React from 'react';
import type { Feature, Event, Article, Benefit, Testimonial } from '../types';
import { NetworkingIcon, LearningIcon, CollaborationIcon, ForumIcon, MarketplaceIcon } from '../components/icons';

import FeatureCard from '../components/FeatureCard';
import BenefitCard from '../components/BenefitCard';
import TestimonialCard from '../components/TestimonialCard';
import EventCard from '../components/EventCard';
import ArticleCard from '../components/ArticleCard';

// --- Mock Data ---

const featuresData: Feature[] = [
  { icon: <ForumIcon className="h-8 w-8 text-white" />, title: 'Forum Diskusi', description: 'Tempat berbagi ide, bertanya, and berdiskusi.' },
  { icon: <LearningIcon className="h-8 w-8 text-white" />, title: 'Event & Pelatihan', description: 'Ikuti webinar & workshop untuk tingkatkan kompetensi.' },
  { icon: <MarketplaceIcon className="h-8 w-8 text-white" />, title: 'Marketplace', description: 'Pamerkan and jual produk Anda ke seluruh anggota.' },
];

const benefitsData: Benefit[] = [
    { icon: <NetworkingIcon className="h-10 w-10 text-primary-600" />, title: 'Networking Luas', description: 'Terhubung dengan para pelaku UMKM, mentor, and investor.' },
    { icon: <LearningIcon className="h-10 w-10 text-primary-600" />, title: 'Belajar & Bertumbuh', description: 'Ikuti pelatihan, webinar, and workshop eksklusif.' },
    { icon: <CollaborationIcon className="h-10 w-10 text-primary-600" />, title: 'Kolaborasi Bisnis', description: 'Temukan mitra bisnis potensial and ciptakan peluang baru.' },
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
        role: "Founder Startup Teknologi",
        image: "https://picsum.photos/seed/testi3/100/100"
    }
];

// FIX: Changed IDs from number to string to match Event interface
const eventsData: Event[] = [
    { id: '1', date: '2024-07-25', title: 'Digital Marketing 101 untuk UMKM', description: 'Pelajari dasar-dasar pemasaran digital.', image: 'https://picsum.photos/seed/event1/400/300', category: 'Webinar' },
    { id: '2', date: '2024-08-10', title: 'Workshop Manajemen Keuangan', description: 'Kelola keuangan bisnis Anda dengan efektif.', image: 'https://picsum.photos/seed/event2/400/300', category: 'Workshop' },
    { id: '3', date: '2024-08-18', title: 'Sesi Networking Bulanan', description: 'Bertemu and berkenalan dengan anggota.', image: 'https://picsum.photos/seed/event3/400/300', category: 'Networking' },
];

// FIX: Changed IDs from number to string to match Article interface
const articlesData: Article[] = [
    { id: '1', category: 'Tips Bisnis', title: '5 Cara Efektif Mengelola Stok Barang', summary: 'Manajemen stok yang baik adalah kunci efisiensi. Pelajari lima strategi praktis.', content: 'Manajemen stok yang baik adalah kunci efisiensi. Pelajari lima strategi praktis untuk mengoptimalkan persediaan. Dalam artikel ini, kita akan membahas pentingnya inventory turnover, metode FIFO and LIFO, serta penggunaan software untuk mempermudah pengelolaan stok.', author: 'Andi Pratama', date: '2024-07-20', image: 'https://picsum.photos/seed/blog1/400/250', authorImage: 'https://picsum.photos/seed/author1/40/40' },
    { id: '2', category: 'Kolaborasi', title: 'Kisah Sukses Kolaborasi Antar Anggota', summary: 'Lihat bagaimana dua anggota berhasil menggabungkan kekuatan mereka.', content: 'Kolaborasi adalah kunci pertumbuhan di era modern. Artikel ini menceritakan kisah sukses antara pengrajin tas kulit and desainer pakaian dalam menciptakan lini produk fashion yang unik.', author: 'Siti Aminah', date: '2024-07-18', image: 'https://picsum.photos/seed/blog2/400/250', authorImage: 'https://picsum.photos/seed/author2/40/40' },
    { id: '3', category: 'UMKM', title: 'Pentingnya Branding untuk Produk', summary: 'Branding bukan hanya logo. Pahami cara membangun identitas merek yang kuat.', content: 'Branding yang kuat dapat membedakan produk Anda dari kompetitor and membangun loyalitas pelanggan. Topik ini akan membahas elemen-elemen penting dalam branding, mulai dari menentukan target audiens, merancang identitas visual, hingga membangun narasi merek yang menarik.', author: 'Budi Santoso', date: '2024-07-15', image: 'https://picsum.photos/seed/blog3/400/250', authorImage: 'https://picsum.photos/seed/author3/40/40' },
];


// --- Helper Section Component ---

const CardSection: React.FC<{ title: string; children: React.ReactNode; gridCols?: string }> = ({ title, children, gridCols = 'md:grid-cols-2 lg:grid-cols-3' }) => (
    <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-4 mb-8">{title}</h2>
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
            {children}
        </div>
    </section>
);

// --- Main Page Component ---

const AllCardsPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary-600">Koleksi Kartu Komponen</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Sebuah halaman untuk menampilkan semua komponen kartu yang digunakan dalam aplikasi.
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

                    <CardSection title="Event Cards" gridCols="md:grid-cols-3">
                        {eventsData.map((item) => <EventCard key={item.id} event={item} />)}
                    </CardSection>

                    <CardSection title="Article Cards" gridCols="md:grid-cols-3">
                        {articlesData.map((item) => <ArticleCard key={item.id} article={item} />)}
                    </CardSection>
                </div>
            </div>
        </div>
    );
};

export default AllCardsPage;
