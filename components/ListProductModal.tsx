
import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { CloseIcon, CheckCircleIcon, SpinnerIcon, MarketplaceIcon, TrashIcon, ExclamationCircleIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ListProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
}

const ListProductModal: React.FC<ListProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const { currentUser } = useAuth();
  const initialState = { name: '', price: '', stock: '1', category: 'Kuliner' as Product['category'], description: '' };
  const [formData, setFormData] = useState(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const handleClose = () => {
    setFormData(initialState);
    setFiles([]);
    setPreviews([]);
    setSubmitted(false);
    setErrorMessage(null);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      
      const validFiles = newFiles.filter((file: File) => {
          if (file.size > 2 * 1024 * 1024) {
              alert(`File ${file.name} terlalu besar (Max 2MB)`);
              return false;
          }
          return true;
      });

      setFiles(prev => [...prev, ...validFiles]);
      const newPreviews = validFiles.map((file: File) => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
      setPreviews(prev => {
          URL.revokeObjectURL(prev[index]);
          return prev.filter((_, i) => i !== index);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (files.length === 0) {
        alert("Harap unggah minimal 1 foto produk.");
        return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
        const uploadedImages: string[] = [];

        // 1. Upload semua gambar ke Supabase Storage (Bucket: products)
        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);
            
            uploadedImages.push(publicUrl);
        }

        // 2. Masukkan data ke tabel products
        const { error } = await supabase.from('products').insert({
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            description: formData.description,
            seller_id: currentUser.id,
            images: uploadedImages,
            rating: 5.0,
            reviews_count: 0
        });

        if (error) {
            // Deteksi spesifik error RLS (Row-Level Security)
            if (error.message.includes('row-level security policy') || error.code === '42501') {
                throw new Error("Izin Database Diperlukan: Anda belum memiliki izin (Policy) untuk menambah data ke tabel 'products'. Silakan hubungi Admin untuk menjalankan skrip DB Fixer.");
            }
            throw error;
        }

        setSubmitted(true);
        onAddProduct(formData); 
        setTimeout(handleClose, 2000);
    } catch (error: any) {
        console.error("Submission Error:", error);
        setErrorMessage(error.message || "Terjadi kesalahan sistem saat menerbitkan produk.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div ref={modalRef} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
        <div className="sticky top-0 bg-white z-10 px-8 py-5 border-b flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Jual Produk Baru</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">Marketplace Komunitas UMKM</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {submitted ? (
             <div className="text-center py-12 animate-fade-in-up">
                <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircleIcon className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">Produk Berhasil Terbit!</h3>
                <p className="mt-3 text-gray-600 font-medium">Terima kasih telah berkontribusi di ekosistem ekonomi komunitas kami.</p>
            </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                    <div className="bg-red-50 border-2 border-red-100 p-5 rounded-2xl flex items-start gap-4 animate-fade-in-up">
                        <ExclamationCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-800 font-black text-sm uppercase tracking-tight">Terjadi Kesalahan</p>
                            <p className="text-red-700 text-sm mt-1 leading-relaxed">{errorMessage}</p>
                            {errorMessage.includes('Izin Database') && (
                                <p className="text-red-600 text-xs mt-3 font-bold bg-white/50 p-2 rounded-lg">Admin: Silakan buka menu Manajemen Pengguna dan jalankan "DB Fixer Setup".</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Nama Produk *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" placeholder="Contoh: Kopi Gayo 250gr" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Harga (Rp) *</label>
                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-primary-600" placeholder="50000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Kategori</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-gray-700 appearance-none">
                            <option>Kuliner</option>
                            <option>Fashion</option>
                            <option>Kerajinan</option>
                            <option>Jasa</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Stok Tersedia *</label>
                        <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
                    </div>
                </div>

                 <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Deskripsi Produk *</label>
                    <textarea name="description" rows={4} required value={formData.description} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm leading-relaxed" placeholder="Jelaskan detail keunggulan, bahan, dan cara pemesanan produk Anda..." />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Foto Produk (Max 5)</label>
                    
                    {previews.length > 0 && (
                        <div className="grid grid-cols-5 gap-3">
                            {previews.map((src, i) => (
                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100">
                                    <img src={src} className="w-full h-full object-cover" alt="" />
                                    <button 
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 5 && (
                                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                    <span className="text-2xl text-gray-300 group-hover:text-primary-500">+</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                    )}

                    {previews.length === 0 && (
                        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center bg-gray-50/50 hover:bg-gray-50 transition-all group cursor-pointer relative">
                            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                            <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-4 group-hover:scale-110 transition-transform">
                                <MarketplaceIcon className="h-10 w-10 text-primary-400" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-700">Unggah Foto Produk</h4>
                            <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Format JPG, PNG (Max 2MB per file)</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={handleClose} className="flex-1 px-8 py-4 border-2 border-gray-100 rounded-2xl font-black text-sm text-gray-500 hover:bg-gray-50 transition-all active:scale-95 uppercase tracking-widest">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-gray-300 disabled:shadow-none uppercase tracking-widest">
                    {isSubmitting ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : null}
                    {isSubmitting ? 'Mengirim Data...' : 'Terbitkan Produk'}
                  </button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProductModal;
