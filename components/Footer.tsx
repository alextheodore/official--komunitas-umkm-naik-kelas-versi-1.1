import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon, WhatsAppIcon, YouTubeIcon, InstagramIcon, EmailIcon, LocationIcon, PhoneIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <LogoIcon className="h-8 w-auto text-primary-600" />
              <span className="text-xl font-bold text-gray-800">Komunitas UMKM Naik Kelas</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Komunitas digital untuk memajukan Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia melalui kolaborasi, edukasi, dan inovasi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><WhatsAppIcon className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><YouTubeIcon className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><InstagramIcon className="h-6 w-6" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/#about" className="text-gray-600 hover:text-primary-500">Tentang Kami</Link></li>
              <li><Link to="/events" className="text-gray-600 hover:text-primary-500">Event & Pelatihan</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary-500">Berita & Artikel</Link></li>
              <li><Link to="/marketplace" className="text-gray-600 hover:text-primary-500">Marketplace</Link></li>
              <li><Link to="/forum" className="text-gray-600 hover:text-primary-500">Forum</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Program Kami</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/programs#forum" className="text-gray-600 hover:text-primary-500">Forum Diskusi</Link></li>
              <li><Link to="/programs#events" className="text-gray-600 hover:text-primary-500">Event & Pelatihan</Link></li>
              <li><Link to="/programs#marketplace" className="text-gray-600 hover:text-primary-500">Marketplace</Link></li>
              <li><Link to="/programs#networking" className="text-gray-600 hover:text-primary-500">Networking</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Hubungi Kami</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start">
                <LocationIcon className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-600">Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center">
                <EmailIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                <a href="mailto:support@umkmnaikkelas.id" className="text-gray-600 hover:text-primary-500">support@umkmnaikkelas.id</a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                <a href="tel:+62211234567" className="text-gray-600 hover:text-primary-500">+62 21 1234 567</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Komunitas UMKM Naik Kelas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;