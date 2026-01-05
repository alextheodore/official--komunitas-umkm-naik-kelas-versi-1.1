import React from 'react';
import { Link } from 'react-router-dom';
import { ForumIcon, LearningIcon, MarketplaceIcon, NetworkingIcon, CheckCircleIcon } from '../components/icons';

// Feature Detail Component
const FeatureDetail: React.FC<{
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  benefits: string[];
  ctaLink: string;
  ctaText: string;
  reverse?: boolean;
}> = ({ id, icon, title, description, imageUrl, benefits, ctaLink, ctaText, reverse = false }) => (
  <section id={id} className={`py-20 ${reverse ? 'bg-gray-50' : 'bg-white'}`}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
        <div className={reverse ? 'md:col-start-2' : ''}>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              {icon}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h2>
          </div>
          <p className="mt-4 text-gray-600 text-lg">{description}</p>
          <ul className="mt-6 space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="flex-shrink-0 h-6 w-6 text-green-500 mr-3" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to={ctaLink} className="inline-block px-8 py-3 text-lg font-semibold text-white bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105">
              {ctaText}
            </Link>
          </div>
        </div>
        <div className={reverse ? 'md:col-start-1' : ''}>
          <img src={imageUrl} alt={title} className="rounded-lg shadow-xl" />
        </div>
      </div>
    </div>
  </section>
);


const ProgramsPage: React.FC = () => {
  const programs = [
    {
      id: 'forum',
      icon: <ForumIcon className="h-7 w-7 text-primary-600" />,
      title: 'Forum Diskusi',
      description: 'Ruang kolaborasi digital di mana anggota dapat berbagi pengetahuan, meminta saran, dan membangun koneksi. Diskusikan tren industri, tantangan bisnis, dan temukan solusi inovatif bersama.',
      imageUrl: 'https://picsum.photos/seed/program1/500/400',
      benefits: [
        'Dapatkan jawaban atas pertanyaan bisnis Anda dari para ahli.',
        'Berpartisipasi dalam diskusi kelompok berdasarkan industri atau minat.',
        'Bagikan pengalaman dan kesuksesan Anda untuk menginspirasi orang lain.',
        'Bangun reputasi sebagai pemimpin pemikiran di bidang Anda.',
      ],
      ctaLink: '/forum',
      ctaText: 'Kunjungi Forum',
      reverse: false,
    },
    {
      id: 'events',
      icon: <LearningIcon className="h-7 w-7 text-primary-600" />,
      title: 'Event & Pelatihan',
      description: 'Tingkatkan kapasitas bisnis dan keahlian personal Anda melalui serangkaian webinar, workshop, dan sesi pelatihan eksklusif yang dibawakan oleh para pakar industri.',
      imageUrl: 'https://picsum.photos/seed/program2/500/400',
      benefits: [
        'Akses materi pembelajaran terkini dan relevan.',
        'Belajar langsung dari praktisi dan mentor berpengalaman.',
        'Dapatkan sertifikat penyelesaian untuk setiap program.',
        'Perluas jaringan profesional Anda selama sesi interaktif.',
      ],
      ctaLink: '/events',
      ctaText: 'Lihat Semua Event',
      reverse: true,
    },
    {
      id: 'marketplace',
      icon: <MarketplaceIcon className="h-7 w-7 text-primary-600" />,
      title: 'Marketplace Komunitas',
      description: 'Etalase digital eksklusif untuk memamerkan dan menjual produk atau jasa Anda kepada ribuan anggota komunitas. Perluas jangkauan pasar dan tingkatkan penjualan Anda di lingkungan yang suportif.',
      imageUrl: 'https://picsum.photos/seed/program3/500/400',
      benefits: [
        'Tingkatkan visibilitas merek dan produk Anda.',
        'Jangkau audiens yang relevan dan tertarget.',
        'Transaksi aman dan mudah di dalam platform.',
        'Dapatkan ulasan dan testimoni dari sesama anggota.',
      ],
      ctaLink: '/marketplace',
      ctaText: 'Jelajahi Marketplace',
      reverse: false,
    },
    {
      id: 'networking',
      icon: <NetworkingIcon className="h-7 w-7 text-primary-600" />,
      title: 'Networking & Kolaborasi',
      description: 'Temukan mitra bisnis potensial, investor, atau kolaborator untuk proyek Anda. Fasilitas networking kami dirancang untuk menciptakan sinergi dan peluang pertumbuhan bersama.',
      imageUrl: 'https://picsum.photos/seed/program4/500/400',
      benefits: [
        'Akses direktori anggota untuk menemukan koneksi yang tepat.',
        'Ikuti sesi "speed networking" virtual yang terstruktur.',
        'Bergabung dengan proyek kolaborasi yang diinisiasi oleh komunitas.',
        'Dapatkan kesempatan untuk pitching di depan investor.',
      ],
      ctaLink: '/events',
      ctaText: 'Ikut Sesi Networking',
      reverse: true,
    }
  ];

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Fitur & Program Unggulan</h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                Kami menyediakan ekosistem lengkap untuk mendukung setiap aspek pertumbuhan bisnis Anda, dari pembelajaran hingga perluasan pasar.
            </p>
        </div>
      </section>

      {/* Program Details */}
      {programs.map((program, index) => (
        <FeatureDetail
          key={program.id}
          id={program.id}
          icon={program.icon}
          title={program.title}
          description={program.description}
          imageUrl={program.imageUrl}
          benefits={program.benefits}
          ctaLink={program.ctaLink}
          ctaText={program.ctaText}
          reverse={index % 2 !== 0}
        />
      ))}
    </div>
  );
};

export default ProgramsPage;