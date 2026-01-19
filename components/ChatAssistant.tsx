import React, { useState, useRef, useEffect } from 'react';
import { ChatBotIcon, CloseIcon, PaperAirplaneIcon } from './icons';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Halo! Saya asisten virtual Komunitas UMKM Naik Kelas. Ada yang bisa saya bantu hari ini?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine if controlled or uncontrolled
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const toggleChat = () => {
    if (isControlled && onToggle) {
        onToggle();
    } else {
        setInternalIsOpen(!internalIsOpen);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = getBotResponse(newUserMessage.text);
      setMessages(prev => [...prev, { id: Date.now(), text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('daftar') || lowerInput.includes('gabung')) {
      return "Untuk bergabung, Anda bisa klik tombol 'Daftar' di pojok kanan atas halaman. Gratis!";
    } else if (lowerInput.includes('produk') || lowerInput.includes('jual')) {
      return "Anda bisa mulai menjual produk dengan masuk ke akun Anda, lalu klik tombol 'Jual Produk' di halaman Marketplace atau Header.";
    } else if (lowerInput.includes('event') || lowerInput.includes('acara')) {
      return "Kami memiliki banyak event menarik! Cek halaman 'Event & Pelatihan' untuk jadwal terbaru webinar dan workshop.";
    } else if (lowerInput.includes('siapa') || lowerInput.includes('tentang')) {
      return "Saya adalah asisten AI untuk Komunitas UMKM Naik Kelas, siap membantu menjawab pertanyaan dasar Anda seputar platform ini.";
    } else {
      return "Maaf, saya belum mengerti pertanyaan spesifik itu. Namun, Anda bisa menjelajahi menu di atas atau menghubungi tim support kami di halaman Kontak.";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fade-in-up h-[500px]">
          {/* Header */}
          <div className="bg-primary-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <ChatBotIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Asisten UMKM</h3>
                <p className="text-xs text-primary-100">Online</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className="group flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300"
        aria-label="Buka Chat Assistant"
      >
        {isOpen ? (
          <CloseIcon className="h-6 w-6" />
        ) : (
          <ChatBotIcon className="h-7 w-7" />
        )}
        {/* Tooltip for button when closed */}
        {!isOpen && (
          <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Tanya Asisten
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;