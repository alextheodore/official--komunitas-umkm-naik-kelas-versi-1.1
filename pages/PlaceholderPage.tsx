import React from 'react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-600">{title}</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700">Segera Hadir!</p>
            <p className="mt-2 text-gray-600 max-w-xl mx-auto">
                Kami sedang bekerja keras untuk menyiapkan fitur ini untuk Anda. Nantikan pembaruan dari kami!
            </p>
            <div className="mt-8">
                <Link
                to="/"
                className="inline-block px-8 py-3 text-lg font-semibold text-white bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                Kembali ke Beranda
                </Link>
            </div>
            <div className="mt-16">
                <svg className="mx-auto h-48 w-48 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M19 3v4M3 10h18" />
                </svg>
            </div>
        </div>
    </div>
  );
};

export default PlaceholderPage;
