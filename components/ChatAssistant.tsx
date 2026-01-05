
import React, { useState, useRef, useEffect } from 'react';
import { ChatBotIcon, CloseIcon, PaperAirplaneIcon, SpinnerIcon } from './icons';
import { GoogleGenAI } from '@google/genai';

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
    { id: 1, text: "Halo! Saya Mentor AI UMKM Naik Kelas. Ada yang bisa saya bantu terkait strategi bisnis Anda hari ini?", sender: 'bot' }
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const userMsgId = Date.now();
    
    setMessages(prev => [...prev, { id: userMsgId, text: userText, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const botMsgId = userMsgId + 1;
      
      // Placeholder for streaming bot message
      setMessages(prev => [...prev, { id: botMsgId, text: '', sender: 'bot' }]);

      const result = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
            systemInstruction: "Anda adalah asisten cerdas untuk Komunitas UMKM Naik Kelas di Indonesia. Tugas Anda adalah membantu pelaku UMKM dengan saran bisnis, tips pemasaran, regulasi lokal (seperti NIB/BPOM), dan motivasi. Gunakan bahasa Indonesia yang ramah, profesional, dan mudah dimengerti. Jika ditanya tentang fitur web ini, sebutkan kita punya Forum, Marketplace, dan Event Pelatihan.",
            temperature: 0.7,
            topP: 0.95,
        }
      });

      let fullResponse = "";
      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { id: Date.now(), text: "Maaf, koneksi ke otak AI saya terganggu. Coba lagi sebentar lagi ya.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-fade-in-up h-[550px]">
          <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-4 flex justify-between items-center text-white shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <ChatBotIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase">Mentor AI Bisnis</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-primary-100 font-bold uppercase">Online & Siap Membantu</p>
                </div>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto bg-gray-50/50 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-primary-600 text-white rounded-br-none shadow-md' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text || (msg.sender === 'bot' && <div className="flex gap-1 py-1"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span></div>)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanya mentor bisnis AI..."
              className="flex-grow px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-primary-500/40 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200 relative overflow-hidden"
        aria-label="Buka Chat Assistant"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? (
          <CloseIcon className="h-7 w-7 relative z-10" />
        ) : (
          <ChatBotIcon className="h-8 w-8 relative z-10 animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;
