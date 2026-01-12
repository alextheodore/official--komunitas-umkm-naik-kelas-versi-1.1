
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { StarIcon, EmailIcon, WhatsAppIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, ShareIcon, SpinnerIcon, CheckCircleIcon, ExclamationCircleIcon } from '../components/icons';
import ProductCard from '../components/ProductCard';
import DetailPageSkeleton from '../components/skeletons/DetailPageSkeleton';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from '../components/ShareModal';
import Tooltip from '../components/Tooltip';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | undefined>();
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    const [isBuying, setIsBuying] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const { currentUser, isInWishlist, addToWishlist, removeFromWishlist } = useAuth();
    const navigate = useNavigate();

    const VISIBLE_THUMBNAILS = 4;

    const fetchProductDetails = async () => {
        if (!productId) return;
        setLoading(true);
        try {
            // 1. Ambil detail produk dan info penjual dari Supabase
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    profiles:seller_id (id, full_name, business_name, avatar_url, email, phone_number)
                `)
                .eq('id', productId)
                .single();

            if (error) throw error;

            if (data) {
                const mappedProduct: Product = {
                    id: data.id,
                    name: data.name,
                    seller_id: data.seller_id,
                    price: data.price,
                    stock: data.stock,
                    category: data.category,
                    description: data.description,
                    images: data.images || [],
                    rating: data.rating || 0,
                    reviewsCount: data.reviews_count || 0,
                    dateListed: data.created_at,
                    seller: {
                        id: data.profiles.id,
                        name: data.profiles.full_name,
                        businessName: data.profiles.business_name,
                        profilePicture: data.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.profiles.full_name)}`,
                        phone: data.profiles.phone_number || '',
                        email: data.profiles.email || ''
                    }
                };

                setProduct(mappedProduct);
                setMainImage(mappedProduct.images[0]);

                // 2. Ambil Produk Terkait (Kategori sama, ID berbeda)
                const { data: relatedData } = await supabase
                    .from('products')
                    .select(`
                        *,
                        profiles:seller_id (id, full_name, business_name, avatar_url, email, phone_number)
                    `)
                    .eq('category', data.category)
                    .neq('id', data.id)
                    .limit(4);

                if (relatedData) {
                    setRelatedProducts(relatedData.map(rp => ({
                        ...rp,
                        reviewsCount: rp.reviews_count,
                        seller: {
                            id: rp.profiles.id,
                            name: rp.profiles.full_name,
                            businessName: rp.profiles.business_name,
                            profilePicture: rp.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(rp.profiles.full_name)}`,
                            phone: rp.profiles.phone_number || '',
                            email: rp.profiles.email || ''
                        }
                    })));
                }
            }
        } catch (err) {
            console.error("Gagal memuat detail produk:", err);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product) {
            document.title = `${product.name} | Marketplace UMKM Naik Kelas`;
        }
    }, [product]);

    if (loading) return <DetailPageSkeleton />;

    if (!product) {
        return (
            <div className="text-center py-32 bg-gray-50 min-h-screen">
                <ExclamationCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h1 className="text-3xl font-extrabold text-gray-800">Produk tidak ditemukan</h1>
                <p className="mt-2 text-gray-500">Mungkin produk sudah dihapus atau tautan sudah tidak valid.</p>
                <Link to="/marketplace" className="mt-8 inline-block px-8 py-3 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-100">
                    Kembali ke Marketplace
                </Link>
            </div>
        );
    }
    
    const inWishlist = currentUser ? isInWishlist(product.id) : false;
    const isOutOfStock = product.stock === 0;

    const handleWishlistToggle = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (isWishlistLoading) return;
        setIsWishlistLoading(true);
        try {
            if (inWishlist) await removeFromWishlist(product.id);
            else await addToWishlist(product.id);
        } finally {
            setIsWishlistLoading(false);
        }
    };

    const handleBuy = () => {
        if (isBuying || isOutOfStock) return;
        setIsBuying(true);
        setTimeout(() => {
            setIsBuying(false);
            alert('Fitur pembayaran sedang disiapkan. Silakan hubungi penjual via WhatsApp untuk pemesanan manual.');
        }, 1500);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
        }).format(price);
    };

    const handlePrev = () => setThumbnailStartIndex(prev => Math.max(0, prev - 1));
    const handleNext = () => setThumbnailStartIndex(prev => Math.min(product.images.length - VISIBLE_THUMBNAILS, prev + 1));

    const whatsappMessage = `Halo, saya tertarik dengan produk "${product.name}" yang ada di Marketplace UMKM Naik Kelas.`;
    const whatsappLink = `https://wa.me/${product.seller.phone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="animate-fade-in-up">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm relative group bg-gray-50">
                             <img src={mainImage} alt={product.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale-[0.5]' : ''}`} />
                             {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                                    <span className="px-8 py-3 bg-red-600 text-white text-xl font-black rounded-xl shadow-2xl tracking-widest">STOK HABIS</span>
                                </div>
                             )}
                        </div>
                        {product.images.length > 1 && (
                             <div className="mt-4 relative px-2">
                                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(img)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary-500 ring-4 ring-primary-100' : 'border-transparent hover:border-gray-200'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="animate-fade-in-up [animation-delay:0.1s]">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-black uppercase tracking-wider rounded-lg border border-primary-100">{product.category}</span>
                            {product.stock > 0 && <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">Tersedia {product.stock} Stok</span>}
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
                        
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                <StarIcon className="h-5 w-5 text-yellow-400" filled={true} />
                                <span className="ml-1.5 font-black text-yellow-700">{product.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-400">({product.reviewsCount} Ulasan Pelanggan)</span>
                        </div>

                        <div className="mt-8">
                            <p className="text-4xl font-black text-primary-600 tracking-tight">{formatPrice(product.price)}</p>
                            <p className="text-xs text-gray-400 mt-1">* Harga belum termasuk biaya pengiriman</p>
                        </div>

                        <div className="mt-10 space-y-4">
                            <button 
                                onClick={handleBuy} 
                                disabled={isBuying || isOutOfStock}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                                    isBuying || isOutOfStock 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-200 hover:-translate-y-1 active:scale-95'
                                }`}
                            >
                                {isBuying ? <SpinnerIcon className="animate-spin h-6 w-6" /> : null}
                                {isBuying ? 'MEMPROSES...' : isOutOfStock ? 'STOK TIDAK TERSEDIA' : 'BELI SEKARANG'}
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                                    <WhatsAppIcon className="h-5 w-5" /> Chat via WhatsApp
                                </a>
                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={isWishlistLoading}
                                    className={`flex items-center justify-center gap-2 py-4 border-2 font-bold rounded-2xl transition-all ${
                                        inWishlist ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {isWishlistLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : <HeartIcon className="h-5 w-5" filled={inWishlist} />}
                                    {inWishlist ? 'Disukai' : 'Tambah Favorit'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-lg font-black text-gray-900 border-b-2 border-primary-100 pb-2 inline-block">Deskripsi Produk</h3>
                            <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{product.description}</p>
                        </div>
                        
                        <div className="mt-10 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <img src={product.seller.profilePicture} alt="" className="h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-sm" />
                                <div>
                                    <h4 className="font-black text-gray-900 group-hover:text-primary-600 transition-colors">{product.seller.businessName}</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Verified Seller • Jakarta</p>
                                </div>
                            </div>
                            <button onClick={() => setIsShareModalOpen(true)} className="p-3 bg-white rounded-xl text-gray-400 hover:text-primary-600 hover:shadow-md transition-all">
                                <ShareIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="bg-gray-50 py-20 border-t border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-gray-900">Mungkin Anda Suka</h2>
                            <Link to="/marketplace" className="text-sm font-bold text-primary-600 hover:underline">Lihat Semua →</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(related => <ProductCard key={related.id} product={related} />)}
                        </div>
                    </div>
                </section>
            )}
            
            <ShareModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                url={window.location.href} 
                title={product.name} 
            />
        </div>
    );
};

export default ProductDetailPage;
