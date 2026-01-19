
import React, { useState, useRef, useEffect } from 'react';
import { ChatBotIcon, CloseIcon, PaperAirplaneIcon, SpinnerIcon, TrashIcon, SparklesIcon } from './icons';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isError?: boolean;
}

interface ChatAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const QUICK_PROMPTS = [
  "💡 Ide Konten Sosmed",
  "📄 Cara Urus NIB",
  "📈 Strategi Marketing",
  "💰 Tips Kelola Modal"
];

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Halo! Saya Mentor AI UMKM Naik Kelas. Saya bisa membantu Anda dengan strategi bisnis, urusan perizinan, pembuatan konten, hingga analisis data. Ada yang bisa saya bantu hari ini?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const toggleChat = () => {
    if (isControlled && onToggle) {
        onToggle();
    } else {
        setInternalIsOpen(!internalIsOpen);
    }
  };

  const resetChat = () => {
      if (window.confirm("Hapus semua riwayat percakapan?")) {
          setMessages([{ id: 1, text: "Halo! Sesi baru dimulai. Ada topik bisnis atau teknis apa yang ingin kita bahas?", sender: 'bot' }]);
      }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputValue;
    
    if (!textToSend.trim() || isTyping) return;

    const userText = textToSend;
    const userMsgId = Date.now();
    
    setMessages(prev => [...prev, { id: userMsgId, text: userText, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const botMsgId = userMsgId + 1;
      
      setMessages(prev => [...prev, { id: botMsgId, text: '', sender: 'bot' }]);

      // Konstruksi History yang valid dan akurat
      const validHistory = messages
        .filter((msg, idx) => {
          if (idx === 0 && msg.sender === 'bot') return false; // Abaikan greeting pertama
          if (msg.isError) return false;
          return msg.text.trim() !== '';
        })
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      // Pastikan history dimulai dengan 'user'
      const cleanHistory = (validHistory.length > 0 && validHistory[0].role === 'model') 
        ? validHistory.slice(1) 
        : validHistory;

      const contents = [
        ...cleanHistory,
        { role: 'user', parts: [{ text: userText }] }
      ];

      const result = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
            systemInstruction: `Anda adalah "Mentor AI" profesional, cerdas, dan serba bisa untuk Komunitas UMKM Naik Kelas Indonesia. 
            TUGAS UTAMA:
            1. Memberikan saran bisnis yang taktis, teknis, dan strategis.
            2. Membantu tugas umum (coding, copywriting, excel formula, analisis tren).
            3. Memberikan panduan perizinan UMKM Indonesia (NIB, PIRT, Sertifikasi Halal).
            4. Gaya bahasa: Profesional, ramah, inspiratif, namun to-the-point.
            5. Gunakan format Markdown (bold, list, bullet points) untuk keterbacaan yang tinggi. 
            6. Jika ditanya hal di luar bisnis, tetaplah membantu namun arahkan kembali bagaimana hal tersebut bisa bermanfaat bagi produktivitas atau usaha mereka.`,
            temperature: 0.7,
            topP: 0.9,
        },
      });

      let fullResponse = "";
      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        const chunkText = responseChunk.text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
          ));
        }
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [
        ...prev.filter(m => m.id !== userMsgId + 1), 
        { 
          id: Date.now(), 
          text: "Maaf, terjadi gangguan pada sistem otak AI saya. Silakan coba kirim pesan kembali dalam beberapa saat.", 
          sender: 'bot',
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[420px] max-w-[calc(100vw-2.5rem)] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden flex flex-col animate-fade-in-up h-[600px] transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md shadow-inner">
                <ChatBotIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-xs tracking-[0.1em] uppercase">Mentor AI Bisnis</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]"></span>
                    <p className="text-[9px] text-primary-50 font-black uppercase tracking-widest opacity-80">Aktif Melayani</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={resetChat} 
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
                    title="Mulai Sesi Baru"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
                <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-5 overflow-y-auto bg-gray-50/50 space-y-6 custom-scrollbar relative">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div 
                  className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary-600 text-white rounded-br-none font-medium' 
                      : msg.isError 
                        ? 'bg-red-50 border border-red-100 text-red-700 rounded-bl-none' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none prose prose-sm prose-primary'
                  }`}
                >
                  {/* Tampilan Markdown sederhana dengan whitespace wrap */}
                  <div className="whitespace-pre-wrap">
                    {msg.text || (msg.sender === 'bot' && (
                        <div className="flex items-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Quick Suggestions - Tampil hanya jika chat masih sepi */}
            {!isTyping && messages.length < 3 && (
                <div className="flex flex-wrap gap-2 pt-2 animate-fade-in-up [animation-delay:0.5s]">
                    {QUICK_PROMPTS.map(p => (
                        <button 
                            key={p} 
                            onClick={() => handleSendMessage(undefined, p.substring(2))}
                            className="text-[11px] font-bold px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-primary-400 hover:text-primary-600 transition-all shadow-sm"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tulis pertanyaan Anda..."
              className="flex-grow px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              className="p-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-lg active:scale-95 flex items-center justify-center group"
            >
              {isTyping ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : <PaperAirplaneIcon className="h-5 w-5 transform rotate-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
            </button>
          </form>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={toggleChat}
        className={`group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-primary-500/40 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200 ${isOpen ? 'rotate-90' : ''}`}
        aria-label="Buka Mentor AI"
      >
        {isOpen ? <CloseIcon className="h-7 w-7" /> : <ChatBotIcon className="h-8 w-8" />}
        {!isOpen && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-accent border-2 border-white items-center justify-center">
                    <SparklesIcon className="w-2.5 h-2.5 text-gray-900" />
                </span>
            </div>
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;
