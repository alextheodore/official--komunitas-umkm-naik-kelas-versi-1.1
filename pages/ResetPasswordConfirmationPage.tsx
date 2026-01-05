import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '../components/icons';

const ResetPasswordConfirmationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center text-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
            <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500" />
            <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-gray-900">
                Tautan Reset Terkirim!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
                Kami telah mengirimkan tautan untuk mengatur ulang password ke alamat email Anda.
            </p>
            <p className="mt-2 text-sm text-gray-500">
                Silakan periksa kotak masuk Anda (dan jangan lupa folder spam).
            </p>
            <div className="mt-8">
                <Link
                to="/"
                className="inline-block px-8 py-3 text-lg font-semibold text-white bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                Kembali ke Beranda
                </Link>
            </div>
        </div>
    </div>
  );
};

export default ResetPasswordConfirmationPage;
