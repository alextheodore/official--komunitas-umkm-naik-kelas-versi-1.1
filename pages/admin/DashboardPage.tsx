import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import { UsersIcon, MarketplaceIcon, ForumIcon, ChartBarIcon } from '../../components/icons';
import { allUsersData } from '../../data/users';
import { allProductsData } from '../../data/products';
import { allForumThreads } from '../../data/forum';
import AdminStatCardSkeleton from '../../components/skeletons/AdminStatCardSkeleton';

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    
    const stats = [
        {
            icon: <UsersIcon className="h-8 w-8 text-primary-600" />,
            title: 'Total Pengguna',
            value: allUsersData.length,
            caption: '+2 pengguna baru minggu ini'
        },
        {
            icon: <MarketplaceIcon className="h-8 w-8 text-primary-600" />,
            title: 'Total Produk',
            value: allProductsData.length,
            caption: '+5 produk baru minggu ini'
        },
        {
            icon: <ForumIcon className="h-8 w-8 text-primary-600" />,
            title: 'Total Diskusi',
            value: allForumThreads.length,
            caption: '12 balasan baru hari ini'
        },
        {
            icon: <ChartBarIcon className="h-8 w-8 text-primary-600" />,
            title: 'Pengunjung Online',
            value: '128',
            caption: 'Saat ini'
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Selamat datang, {currentUser?.name}!</h1>
            <p className="text-gray-600 mt-1">Ini adalah ringkasan aktivitas di komunitas Anda.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                 {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <AdminStatCardSkeleton key={i} />)
                ) : (
                    stats.map(stat => (
                        <StatCard key={stat.title} {...stat} />
                    ))
                )}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="font-bold text-lg text-gray-800">Aktivitas Terbaru</h2>
                    {loading ? (
                        <div className="animate-pulse mt-4 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-full"></div>
                            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Fitur ini sedang dalam pengembangan.</p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="font-bold text-lg text-gray-800">Pengguna Teratas</h2>
                     {loading ? (
                        <div className="animate-pulse mt-4 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-full"></div>
                            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ) : (
                         <p className="text-sm text-gray-500">Fitur ini sedang dalam pengembangan.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
