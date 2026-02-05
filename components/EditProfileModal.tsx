
import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SpinnerIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        businessName: currentUser.businessName,
      });
      setPreviewImage(currentUser.profilePicture);
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validasi ukuran (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar (Maksimal 2MB)");
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);

    try {
      let finalAvatarUrl = currentUser.profilePicture;

      // 1. Upload ke Supabase Storage jika ada gambar baru
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, profileImage);

        if (uploadError) throw uploadError;

        // Ambil Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        finalAvatarUrl = publicUrl;
      }

      // 2. Update metadata di AuthContext & Profiles Table
      await updateProfile({
        name: formData.name,
        businessName: formData.businessName,
        profilePicture: finalAvatarUrl,
      });

      onClose();
    } catch (error: any) {
      console.error("Gagal memperbarui profil:", error);
      alert("Terjadi kesalahan: " + (error.message || "Gagal upload gambar"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">Edit Profil</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Tutup modal"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-primary-50 shadow-md">
                  <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <label 
                  htmlFor="profile-image-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity text-xs font-bold"
                >
                  Ubah Foto
                </label>
                <input id="profile-image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
              </div>
              <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">PNG atau JPG (Maks. 2MB)</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="businessName" className="block text-sm font-bold text-gray-700 mb-1">Nama Bisnis</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Email (Terkunci)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 text-gray-400 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon className="animate-spin h-5 w-5" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
