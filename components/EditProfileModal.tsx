import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SpinnerIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
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
        email: currentUser.email,
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
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      updateProfile({
        name: formData.name,
        businessName: formData.businessName,
        // In a real app, we would upload the file to storage and get a URL
        profilePicture: profileImage ? previewImage : currentUser?.profilePicture,
      });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">Edit Profil</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
              aria-label="Tutup modal"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200 mb-2">
                <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <label htmlFor="profile-image" className="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-500">
                Ubah Foto
                <input id="profile-image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
              </label>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nama Bisnis</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Tidak dapat diubah)</label>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                value={formData.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md shadow-sm sm:text-sm cursor-not-allowed"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 flex items-center"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
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