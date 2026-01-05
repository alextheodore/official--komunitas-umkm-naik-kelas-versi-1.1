
import React, { useState, useEffect } from 'react';
import type { Event, Article } from '../../types';
import { CloseIcon, SparklesIcon, SpinnerIcon } from '../icons';
import { GoogleGenAI } from '@google/genai';

interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: Event | Article) => void;
    contentType: 'events' | 'articles';
    mode: 'add' | 'edit';
    initialData: Event | Article | null;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, onSave, contentType, mode, initialData }) => {
    const isEvent = contentType === 'events';
    const today = new Date().toISOString().split('T')[0];
    
    const getEmptyState = () => isEvent 
        ? { id: '0', title: '', description: '', category: 'Webinar', date: today, image: 'https://picsum.photos/seed/newevent/400/300' } as any
        : { id: '0', title: '', summary: '', content: '', category: 'Tips Bisnis', date: today, image: 'https://picsum.photos/seed/newarticle/400/250', author: 'Admin', authorImage: '' } as Article;

    const [formData, setFormData] = useState<any>(initialData || getEmptyState());
    const [isGenerating, setIsGenerating] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || getEmptyState());
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleAIGenerate = async () => {
        if (!formData.title) {
            alert("Masukkan judul berita terlebih dahulu agar AI bisa bekerja.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Buatkan konten artikel berita/tips bisnis yang mendalam untuk komunitas UMKM dengan judul: "${formData.title}". 
            Kategori: ${formData.category}.
            Hasil harus dalam Bahasa Indonesia, minimal 4 paragraf panjang, informatif, dan profesional. 
            Berikan juga ringkasan pendek (summary) di bagian akhir dengan format [SUMMARY]: isi ringkasan.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });

            const text = response.text || '';
            const summaryMatch = text.match(/\[SUMMARY\]:(.*)/i);
            const cleanContent = text.replace(/\[SUMMARY\]:(.*)/i, '').trim();
            const summary = summaryMatch ? summaryMatch[1].trim() : cleanContent.substring(0, 150) + '...';

            setFormData((prev: any) => ({
                ...prev,
                content: cleanContent,
                summary: summary
            }));
        } catch (err) {
            console.error("AI Error:", err);
            alert("Gagal menggunakan AI.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    if (!isOpen) return null;

    const title = `${mode === 'add' ? 'Tambah' : 'Edit'} ${isEvent ? 'Event' : 'Artikel'}`;

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-out flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Tutup modal">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1">Judul Utama</label>
                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="Contoh: 5 Strategi Marketing 2024" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all">
                                {isEvent ? (
                                    <>
                                        <option>Webinar</option>
                                        <option>Workshop</option>
                                        <option>Networking</option>
                                        <option>Kompetisi</option>
                                    </>
                                ) : (
                                    <>
                                        <option>Tips Bisnis</option>
                                        <option>Pemasaran</option>
                                        <option>Manajemen</option>
                                        <option>Kolaborasi</option>
                                        <option>UMKM</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-1">Tanggal Publikasi</label>
                            <input type="date" name="date" id="date" required value={formData.date} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                        </div>
                    </div>
                    
                    {isEvent ? (
                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">Deskripsi Event</label>
                            <textarea name="description" id="description" rows={4} required value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm" placeholder="Jelaskan detail acara Anda..." />
                        </div>
                    ) : (
                        <>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="content" className="block text-sm font-bold text-gray-700">Isi Lengkap Artikel</label>
                                    <button 
                                        type="button" 
                                        onClick={handleAIGenerate}
                                        disabled={isGenerating}
                                        className="flex items-center gap-1 text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100 disabled:opacity-50"
                                    >
                                        {isGenerating ? <SpinnerIcon className="h-3 w-3 animate-spin" /> : <SparklesIcon className="h-3 w-3" />}
                                        Bantu tulis dengan AI
                                    </button>
                                </div>
                                <textarea name="content" id="content" rows={10} required value={formData.content} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm" placeholder="Tulis artikel lengkap di sini..." />
                            </div>
                            <div>
                                <label htmlFor="summary" className="block text-sm font-bold text-gray-700 mb-1">Ringkasan (Summary)</label>
                                <textarea name="summary" id="summary" rows={3} required value={formData.summary} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm" placeholder="Ringkasan pendek yang muncul di kartu depan..." />
                            </div>
                        </>
                    )}

                    <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all">
                            Simpan Konten
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContentModal;
