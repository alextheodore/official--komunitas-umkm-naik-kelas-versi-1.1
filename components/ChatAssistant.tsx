import React, { useState } from "react";
import { ChatBotIcon, CloseIcon } from "./icons";

interface ChatAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({
  isOpen: externalIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 h-[650px]">
          {/* Header Biru - Persis seperti di gambar */}
          <div className="bg-[#0066FF] px-4 py-3 flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full border border-white/30">
                <ChatBotIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[15px] leading-tight">
                  Asisten UMKM
                </h3>
                <div className="flex items-center mt-0.5">
                  <div className="w-2 h-2 bg-[#00FF00] rounded-full mr-1.5 shadow-[0_0_8px_rgba(0,255,0,0.6)]"></div>
                  <span className="text-[11px] font-medium text-blue-100">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <CloseIcon className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Body - Mengintegrasikan Streamlit AI INA dengan Background Putih */}
          <div className="flex-grow bg-white relative">
            <iframe
              // Menambahkan embed_options=light_theme untuk memaksa background putih di Streamlit
              src="https://ina-agent.streamlit.app/?embed=true&embed_options=light_theme"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="INA AI Assistant"
              allow="clipboard-read; clipboard-write"
              className="bg-white"
            ></iframe>
          </div>

          {/* Footer Opsional (Jika ingin menutup label Built with Streamlit) */}
          <div className="px-4 py-2 bg-white border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center">
            <span>Powered by INA AI</span>
            <span className="italic">UMKM Naik Kelas</span>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 ${
          isOpen
            ? "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            : "bg-[#0066FF] text-white hover:bg-blue-700"
        }`}
      >
        {isOpen ? (
          <CloseIcon className="h-6 w-6" />
        ) : (
          <ChatBotIcon className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;
