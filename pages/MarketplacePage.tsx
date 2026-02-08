
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { useAuth } from '../contexts/AuthContext';
import { SearchIcon } from '../components/icons';
import { supabase } from '../lib/supabase';

const MarketplacePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentUser, wishlist } = useAuth();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('products')
                .select(`
                    *,
                    profiles:seller_id (id, full_name, business_name, avatar_url, email, phone_number)
                `);
            
            const category = searchParams.get('category');
            if (category && category !== 'Semua') {
                query = query.eq('category', category);
            }

            if (searchParams.get('filter') === 'wishlist' && currentUser) {
                query = query.in('id', wishlist);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) throw error;
            
            // Filter: Pastikan profil penjual ada (bukan null akibat user dihapus)
            // Ini akan menyembunyikan produk "yatim piatu" dari UI marketplace
            const mapped: Product[] = data
                .filter(p => p.profiles !== null)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    seller_id: p.seller_id,
                    price: p.price,
                    stock: p.stock,
                    category: p.category,
                    description: p.description,
                    images: p.images || [],
                    rating: p.rating || 0,
                    reviewsCount: p.reviews_count || 0,
                    dateListed: p.created_at,
                    seller: {
                        id: p.profiles.id,
                        name: p.profiles.full_name,
                        businessName: p.profiles.business_name,
                        profilePicture: p.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.profiles.full_name)}`,
                        phone: p.profiles.phone_number || '',
                        email: p.profiles.email || ''
                    }
                }));

            // Client side search filter
            const filtered = mapped.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.seller?.businessName.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setProducts(filtered);
        } catch (err) {
            console.error("Gagal memuat produk:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchParams, searchQuery]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSearchParams(prev => {
            if (val === 'Semua') prev.delete('category');
            else prev.set('category', val);
            return prev;
        });
    };

    return (
        <div className="bg-white">
            <section className="bg-gray-50 border-b py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Marketplace Komunitas</h1>
                    <p className="mt-4 text-lg text-gray-600">Temukan produk unggulan dari ribuan anggota UMKM Naik Kelas.</p>
                </div>
            </section>
            
            <div className="container mx-auto px-4 py-12">
                <div className="mb-10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Cari produk atau toko..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" 
                        />
                        <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    <select 
                        onChange={handleCategoryChange} 
                        value={searchParams.get('category') || 'Semua'}
                        className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option>Semua</option>
                        <option>Kuliner</option>
                        <option>Fashion</option>
                        <option>Kerajinan</option>
                        <option>Jasa</option>
                        <option>Lainnya</option>
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up">
                        {products.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;
