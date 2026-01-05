import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { allProductsData } from '../data/products';
import { StarIcon, EmailIcon, WhatsAppIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, ShareIcon, SpinnerIcon, CheckCircleIcon, ExclamationCircleIcon } from '../components/icons';
import ProductCard from '../components/ProductCard';
import DetailPageSkeleton from '../components/skeletons/DetailPageSkeleton';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from '../components/ShareModal';
import Tooltip from '../components/Tooltip';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<(typeof allProductsData)[0] | null>();
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | undefined>();
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    // Loading states for buttons
    const [isBuying, setIsBuying] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const { currentUser, isInWishlist, addToWishlist, removeFromWishlist } = useAuth();
    const navigate = useNavigate();

    const VISIBLE_THUMBNAILS = 4;

    useEffect(() => {
        setLoading(true);
        setThumbnailStartIndex(0); // Reset carousel on product change
        const timer = setTimeout(() => {
            const foundProduct = allProductsData.find(p => p.id.toString() === productId);
            setProduct(foundProduct || null);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [productId]);

    useEffect(() => {
        if (product) {
            setMainImage(product.images[0]);
            
            const originalTitle = document.title;
            const descriptionTag = document.querySelector('meta[name="description"]');
            const originalDescription = descriptionTag?.getAttribute('content') || '';
            let keywordsTag = document.querySelector('meta[name="keywords"]');
            const originalKeywords = keywordsTag?.getAttribute('content') || '';
            const wasKeywordsTagMissing = !keywordsTag;

            document.title = `${product.name} oleh ${product.seller.businessName} - Marketplace UMKM`;
            const description = `Beli ${product.name}. ${product.description.substring(0, 120)}... Temukan di marketplace Komunitas UMKM Naik Kelas.`;
            descriptionTag?.setAttribute('content', description);

            if (!keywordsTag) {
                keywordsTag = document.createElement('meta');
                keywordsTag.setAttribute('name', 'keywords');
                document.head.appendChild(keywordsTag);
            }
            keywordsTag.setAttribute('content', `${product.name}, ${product.category}, ${product.seller.businessName}, Produk UMKM`);
            
            return () => {
                document.title = originalTitle;
                descriptionTag?.setAttribute('content', originalDescription);
                if (wasKeywordsTagMissing && keywordsTag) {
                    keywordsTag.remove();
                } else if (keywordsTag) {
                    keywordsTag.setAttribute('content', originalKeywords);
                }
            };
        }
    }, [product]);

    if (loading) {
        return <DetailPageSkeleton />;
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-800">Produk tidak ditemukan</h1>
                <p className="mt-4 text-gray-600">Produk yang Anda cari mungkin telah dihapus atau tidak ada.</p>
                <Link to="/marketplace" className="mt-6 inline-block px-6 py-3 text-white bg-primary-600 rounded-full hover:bg-primary-700">
                    Kembali ke Marketplace
                </Link>
            </div>
        );
    }
    
    const inWishlist = currentUser ? isInWishlist(product.id) : false;
    const isOutOfStock = product.stock === 0;

    const handleWishlistToggle = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        
        if (isWishlistLoading) return;

        setIsWishlistLoading(true);
        
        // Simulate network request delay
        setTimeout(() => {
            if (inWishlist) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product.id);
            }
            setIsWishlistLoading(false);
        }, 800);
    };

    const handleBuy = () => {
        if (isBuying || isOutOfStock) return;
        setIsBuying(true);
        // Simulate processing delay to show spinner
        setTimeout(() => {
            setIsBuying(false);
            alert('Pesanan Anda sedang diproses. Terima kasih telah berbelanja di UMKM Naik Kelas! (Simulasi)');
        }, 2000);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handlePrev = () => {
        setThumbnailStartIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setThumbnailStartIndex(prev => Math.min(product.images.length - VISIBLE_THUMBNAILS, prev + 1));
    };

    // Updated logic: Filter products by same category OR same seller, excluding current product
    const relatedProducts = allProductsData
        .filter(p => (p.category === product.category || p.seller.id === product.seller.id) && p.id !== product.id)
        .slice(0, 4);

    const whatsappMessage = `Halo, saya tertarik dengan produk "${product.name}" yang ada di marketplace Komunitas UMKM Naik Kelas.`;
    const whatsappLink = `https://wa.me/${product.seller.phone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    const emailSubject = `Pertanyaan mengenai produk: ${product.name}`;
    const emailLink = `mailto:${product.seller.email}?subject=${encodeURIComponent(emailSubject)}`;
    
    const productUrl = window.location.href;

    return (
        <>
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div>
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg border border-gray-200 relative">
                             <img src={mainImage} alt={product.name} className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale-[0.8]' : ''}`} />
                             {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <span className="px-6 py-2 bg-red-600 text-white text-xl font-bold rounded-md shadow-lg">STOK HABIS</span>
                                </div>
                             )}
                        </div>
                        {product.images.length > 1 && (
                             <div className="mt-4 relative px-10">
                                {product.images.length > VISIBLE_THUMBNAILS && (
                                    <>
                                        <button
                                            onClick={handlePrev}
                                            disabled={thumbnailStartIndex === 0}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={thumbnailStartIndex >= product.images.length - VISIBLE_THUMBNAILS}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            aria-label="Next image"
                                        >
                                            <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                                        </button>
                                    </>
                                )}
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.slice(thumbnailStartIndex, thumbnailStartIndex + VISIBLE_THUMBNAILS).map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(img)}
                                            className={`block aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2 transition ${mainImage === img ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent hover:border-primary-300'}`}
                                        >
                                            <img src={img} alt={`${product.name} thumbnail ${thumbnailStartIndex + index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <span className="text-sm font-semibold text-primary-600 uppercase">{product.category}</span>
                        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">{product.name}</h1>
                        
                        <div className="mt-4 flex items-center space-x-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" filled={i < Math.round(product.rating)} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{product.rating.toFixed(1)} ({product.reviewsCount} ulasan)</span>
                        </div>

                        <div className="mt-6">
                            <Tooltip content="Harga belum termasuk ongkos kirim">
                                <p className="text-3xl font-bold text-gray-800 cursor-help w-fit">{formatPrice(product.price)}</p>
                            </Tooltip>
                        </div>

                        {/* Stock Status */}
                        <div className="mt-4 flex items-center space-x-2">
                            {isOutOfStock ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <ExclamationCircleIcon className="w-4 h-4 mr-1" /> Stok Habis
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Stok Tersedia: {product.stock}
                                </span>
                            )}
                        </div>
                        
                        <div className="mt-6">
                            <button 
                                onClick={handleBuy} 
                                disabled={isBuying || isOutOfStock}
                                className={`w-full text-white text-lg font-bold py-4 rounded-lg shadow-md transition-all duration-200 mb-4 flex items-center justify-center ${
                                    isBuying || isOutOfStock 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-primary-600 hover:bg-primary-700 hover:shadow-xl hover:scale-[1.02]'
                                }`}
                            >
                                {isBuying ? (
                                    <>
                                        <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Memproses...
                                    </>
                                ) : isOutOfStock ? (
                                    'Stok Habis'
                                ) : (
                                    'Beli Sekarang'
                                )}
                            </button>
                        </div>

                        <div className="mt-2">
                            <h3 className="text-lg font-semibold text-gray-800">Deskripsi Produk</h3>
                            <p className="mt-2 text-gray-600 whitespace-pre-wrap">{product.description}</p>
                        </div>
                        
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                            <h4 className="font-semibold text-gray-800">Informasi Penjual</h4>
                             <div className="mt-3 flex items-center">
                                <img src={product.seller.profilePicture} alt={product.seller.name} className="h-12 w-12 rounded-full object-cover" />
                                <div className="ml-4">
                                    <Link to={`/sellers/${product.seller.id}`} className="font-bold text-gray-800 hover:text-primary-600 hover:underline transition-colors">
                                      {product.seller.businessName}
                                    </Link>
                                    <p className="text-sm text-gray-500">{product.seller.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={isWishlistLoading}
                                    className={`flex items-center justify-center px-4 py-3 border text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                                        inWishlist
                                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {isWishlistLoading ? (
                                        <SpinnerIcon className="animate-spin h-5 w-5 mr-2 text-current" />
                                    ) : (
                                        <HeartIcon className="h-5 w-5 mr-2" filled={inWishlist} />
                                    )}
                                    {inWishlist ? 'Hapus Wishlist' : 'Wishlist'}
                                </button>
                                <button
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <ShareIcon className="h-5 w-5 mr-2" />
                                    Bagikan
                                </button>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                                    Beli via WhatsApp
                                </a>
                                <a href={emailLink} className="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    <EmailIcon className="h-5 w-5 mr-2" />
                                    Hubungi Penjual
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Produk Terkait & Lainnya dari Penjual</h2>
                        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {loading ? 
                                Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) :
                                relatedProducts.map(related => <ProductCard key={related.id} product={related} />)
                            }
                        </div>
                    </div>
                </section>
            )}
        </div>
        <ShareModal 
            isOpen={isShareModalOpen} 
            onClose={() => setIsShareModalOpen(false)} 
            url={productUrl} 
            title={product.name} 
        />
        </>
    );
};

export default ProductDetailPage;