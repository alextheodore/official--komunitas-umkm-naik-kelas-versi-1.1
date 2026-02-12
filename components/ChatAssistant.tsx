import React, { useState } from 'react';
import { ChatBotIcon, CloseIcon } from './icons';

interface ChatAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Gunakan state eksternal atau internal
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const toggleChat = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fade-in-up h-[600px]">
          
          {/* Header - Sesuai dengan desain biru di gambar */}
          <div className="bg-[#0066FF] p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <ChatBotIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Asisten UMKM</h3>
                <p className="text-xs text-blue-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Body - Mengintegrasikan Streamlit AI INA */}
          <div className="flex-grow bg-gray-50 relative">
            <iframe
              // GANTI URL DI BAWAH DENGAN URL STREAMLIT ANDA
              src="https://ina-prototype.streamlit.app/?embed=true&embed_options=light_theme"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="INA AI Assistant"
              allow="clipboard-read; clipboard-write"
            ></iframe>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-0' : 'bg-[#0066FF] hover:bg-blue-700'
        }`}
      >
        {isOpen ? (
          <CloseIcon className="h-7 w-7 text-white" />
        ) : (
          <ChatBotIcon className="h-8 w-8 text-white" />
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;