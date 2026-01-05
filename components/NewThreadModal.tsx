
import React, { useState, useEffect, useRef } from 'react';
import type { ForumThread } from '../types';
import { CloseIcon, CheckCircleIcon, SpinnerIcon } from './icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface NewThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddThread: () => void;
}

const NewThreadModal: React.FC<NewThreadModalProps> = ({ isOpen, onClose, onAddThread }) => {
  const { currentUser } = useAuth();
  const initialState = { title: '', category: 'Tips Bisnis' as ForumThread['category'], content: '' };
  const [formData, setFormData] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
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
    setSubmitted(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Judul dan isi diskusi tidak boleh kosong.");
      return;
    }
    
    setIsSubmitting(true);
    try {
        // 1. Simpan Thread Baru
        const { data: thread, error: threadError } = await supabase
            .from('forum_threads')
            .insert({
                title: formData.title,
                category: formData.category,
                author_id: currentUser.id,
                views: 0,
                upvotes: 0,
                downvotes: 0
            })
            .select()
            .single();

        if (threadError) throw threadError;

        // 2. Simpan Post Pertama (Konten Utama)
        const { error: postError } = await supabase
            .from('forum_posts')
            .insert({
                thread_id: thread.id,
                author_id: currentUser.id,
                content: formData.content,
                upvotes: 0,
                downvotes: 0
            });

        if (postError) throw postError;

        setSubmitted(true);
        onAddThread();
        setTimeout(handleClose, 2000);
    } catch (err: any) {
        alert(err.message || "Gagal membuat diskusi.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-out flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Mulai Diskusi Baru</h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {submitted ? (
             <div className="text-center py-16 animate-fade-in-up">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="mt-4 text-2xl font-bold text-gray-800">Diskusi Berhasil Dibuat!</h3>
                <p className="mt-2 text-gray-600">Terima kasih telah berbagi dengan komunitas.</p>
            </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Judul Diskusi*</label>
                  <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    required 
                    value={formData.title} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                    placeholder="Contoh: Bagaimana cara mengurus NIB?"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                  <select 
                    name="category" 
                    id="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option>Tips Bisnis</option>
                    <option>Pemasaran</option>
                    <option>Manajemen</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">Isi Diskusi*</label>
                    <textarea 
                        name="content" 
                        id="content" 
                        rows={8} 
                        required 
                        value={formData.content} 
                        onChange={handleChange} 
                        placeholder="Tulis pertanyaan atau topik diskusi Anda di sini..." 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm" 
                    />
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={handleClose} className="flex-1 py-4 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? <SpinnerIcon className="animate-spin h-5 w-5" /> : 'Publikasikan'}
                  </button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewThreadModal;
