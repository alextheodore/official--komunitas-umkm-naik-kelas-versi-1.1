import React, { useEffect, useRef } from 'react';
import { CloseIcon, ExclamationCircleIcon } from './icons';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-4 text-left">
                <h3 id="logout-modal-title" className="text-lg leading-6 font-bold text-gray-900">
                    Konfirmasi Keluar
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin keluar dari akun Anda?
                    </p>
                </div>
            </div>
             <button
              onClick={onClose}
              className="ml-auto p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
              aria-label="Tutup modal"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;