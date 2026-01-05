
import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { GoogleGenAI } from '@google/genai';
// Added MarketplaceIcon to the imported icons to resolve missing component error.
import { CloseIcon, CheckCircleIcon, SparklesIcon, SpinnerIcon, MarketplaceIcon } from './icons';
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
  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setFormData(initialState);
    setFiles([]);
    setSubmitted(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name.trim()) {
      alert("Harap isi Nama Produk terlebih dahulu.");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Buatkan deskripsi produk yang menarik, persuasif, dan profesional untuk marketplace UMKM dengan data berikut:
      Nama Produk: "${formData.name}"
      Kategori: "${formData.category}"
      
      Aturan:
      - Gunakan Bahasa Indonesia yang ramah tapi tetap profesional.
      - Tonjolkan nilai jual produk.
      - Maksimal 3 paragraf.
      - Sertakan ajakan untuk membeli (Call to Action).
      - Jangan sertakan harga atau nama toko.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setFormData(prev => ({ ...prev, description: response.text || '' }));
    } catch (error) {
      console.error("AI Error:", error);
      alert("Gagal membuat deskripsi otomatis.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
        // 1. Logika Upload Image (Dalam demo ini kita gunakan placeholder URL karena bucket storage butuh setup manual)
        const placeholderImages = ['https://picsum.photos/seed/product/800/600'];

        // 2. Insert ke Supabase
        const { error } = await supabase.from('products').insert({
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            description: formData.description,
            seller_id: currentUser.id,
            images: placeholderImages,
            rating: 5.0,
            reviews_count: 0
        });

        if (error) throw error;

        setSubmitted(true);
        setTimeout(handleClose, 2000);
    } catch (error: any) {
        alert(error.message || "Gagal menambahkan produk.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div ref={modalRef} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Jual Produk Baru</h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><CloseIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-6">
          {submitted ? (
             <div className="text-center py-12 animate-fade-in-up">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" />
                <h3 className="mt-6 text-2xl font-bold text-gray-900">Produk Berhasil Terbit!</h3>
                <p className="mt-2 text-gray-600">Produk Anda sekarang dapat dilihat oleh seluruh anggota komunitas.</p>
            </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Produk *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all" placeholder="Contoh: Kopi Gayo 250gr" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp) *</label>
                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all" placeholder="50000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                            <option>Kuliner</option>
                            <option>Fashion</option>
                            <option>Kerajinan</option>
                            <option>Jasa</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stok *</label>
                        <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                    </div>
                </div>

                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-gray-700">Deskripsi Produk *</label>
                        <button 
                            type="button" 
                            onClick={handleGenerateDescription}
                            disabled={isGenerating || !formData.name}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 disabled:opacity-50 transition-all text-xs font-bold"
                        >
                            {isGenerating ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <SparklesIcon className="h-4 w-4" />}
                            Bantu tulis dengan AI
                        </button>
                    </div>
                    <textarea name="description" rows={5} required value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm" placeholder="Jelaskan detail keunggulan produk Anda..." />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Produk</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <input type="file" multiple className="hidden" id="product-images" accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                        <label htmlFor="product-images" className="cursor-pointer">
                            <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                                <MarketplaceIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600">Klik untuk upload foto atau seret ke sini</p>
                            <p className="text-xs text-gray-400 mt-1">Maksimal 5 foto (PNG/JPG)</p>
                        </label>
                    </div>
                    {files.length > 0 && <p className="mt-2 text-xs text-primary-600 font-bold">{files.length} foto dipilih.</p>}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handleClose} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : 'Terbitkan Produk'}
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
