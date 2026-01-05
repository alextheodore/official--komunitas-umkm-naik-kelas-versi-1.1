import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { StarIcon, HeartIcon, ShareIcon, SpinnerIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from './ShareModal';
import Tooltip from './Tooltip';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currentUser, isInWishlist, addToWishlist, removeFromWishlist } = useAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Loading states
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const inWishlist = currentUser ? isInWishlist(product.id) : false;
  const isOutOfStock = product.stock === 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
        navigate('/login');
        return;
    }
    
    if (isWishlistLoading) return;

    setIsWishlistLoading(true);

    // Simulate processing delay
    setTimeout(() => {
        if (inWishlist) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product.id);
        }
        setIsWishlistLoading(false);
    }, 800);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBuying || isOutOfStock) return;

    setIsBuying(true);
    // Simulate processing delay
    setTimeout(() => {
        setIsBuying(false);
        // Normally navigate to checkout or show modal
        alert(`Memulai pembelian untuk ${product.name}... (Fitur segera hadir)`);
    }, 1500);
  };
  
  const productUrl = `${window.location.origin}/#/marketplace/${product.id}`;


  return (
    <>
    <Link to={`/marketplace/${product.id}`} className={`block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] group flex flex-col ${isOutOfStock ? 'opacity-80' : ''}`}>
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={`Foto produk ${product.name}`}
          loading="lazy"
          className={`w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'grayscale-[0.5]' : ''}`}
        />
        <div className="absolute top-3 left-3 flex gap-2">
             <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-500/80 text-white backdrop-blur-sm">
                {product.category}
            </span>
            {isOutOfStock && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-600/90 text-white backdrop-blur-sm">
                    Habis
                </span>
            )}
        </div>
       
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className="p-2 bg-white/80 rounded-full text-gray-600 hover:text-red-500 hover:bg-white backdrop-blur-sm transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label={inWishlist ? "Hapus dari wishlist" : "Tambah ke wishlist"}
            >
                {isWishlistLoading ? (
                    <SpinnerIcon className="w-5 h-5 text-primary-600 animate-spin" />
                ) : (
                    <HeartIcon className="w-5 h-5" filled={inWishlist} />
                )}
            </button>
             <button
            onClick={handleShareClick}
            className="p-2 bg-white/80 rounded-full text-gray-600 hover:text-primary-600 hover:bg-white backdrop-blur-sm transition-all duration-200 shadow-sm"
            aria-label="Bagikan produk"
            >
            <ShareIcon className="w-5 h-5" />
            </button>
        </div>
        
        {!isOutOfStock && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button 
                    onClick={handleBuyClick}
                    disabled={isBuying}
                    className="bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center disabled:bg-primary-400 disabled:cursor-not-allowed"
                 >
                     {isBuying ? (
                        <SpinnerIcon className="w-3 h-3 animate-spin mr-1" />
                     ) : null}
                     {isBuying ? 'Proses...' : 'Beli'}
                 </button>
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 flex-grow">
          {product.name}
        </h3>
        <div className="mt-2">
            <Tooltip content="Harga belum termasuk ongkos kirim">
                <p className="text-lg font-extrabold text-primary-600 cursor-help w-fit">{formatPrice(product.price)}</p>
            </Tooltip>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <p className="text-gray-500">{product.seller.businessName}</p>
            <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-600 font-semibold ml-1">{product.rating}</span>
            </div>
        </div>
      </div>
    </Link>
    <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={productUrl} 
        title={product.name} 
    />
    </>
  );
};

export default ProductCard;