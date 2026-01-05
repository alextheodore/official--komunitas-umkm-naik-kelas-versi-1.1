
import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, FacebookIcon, TwitterIcon, LinkedInIcon, WhatsAppIcon, LinkIcon, CheckCircleIcon } from './icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Bagikan Produk</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">Bagikan produk ini ke teman atau media sosial Anda.</p>

        <div className="flex justify-center space-x-4 mb-6">
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FacebookIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-500">Facebook</span>
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600 group-hover:bg-blue-400 group-hover:text-white transition-colors">
                    <TwitterIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-500">Twitter</span>
            </a>
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <WhatsAppIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-500">WhatsApp</span>
            </a>
            <button onClick={handleCopy} className="flex flex-col items-center space-y-2 group">
                <div className="p-3 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-700 group-hover:text-white transition-colors relative">
                    {copied ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> : <LinkIcon className="h-6 w-6" />}
                </div>
                <span className="text-xs text-gray-500">{copied ? 'Disalin!' : 'Salin Link'}</span>
            </button>
        </div>
        
        <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate flex-1 mr-2">{url}</span>
            <button onClick={handleCopy} className="text-xs font-bold text-primary-600 hover:text-primary-700">
                {copied ? 'Disalin' : 'Salin'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
