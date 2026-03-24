import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Sparkles, 
  Flame, 
  Bot, 
  User, 
  Mic, 
  Image as ImageIcon,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const KafrawyAI: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً بك في كفراوي AI! كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isDangerousMode, setIsDangerousMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: isDangerousMode 
            ? "أنت 'كفراوي AI' في الوضع الخطير. قدم حلولاً إبداعية وجريئة بلهجة مصرية ذكية وفكاهية. كن صريحاً ومباشراً ومبدعاً جداً في حل المشكلات."
            : "أنت 'كفراوي AI' مساعد ذكي لسكان منطقة الكفراوي بمدينة العبور. ساعد المستخدمين في استخدام التطبيق وكتابة المحتوى بلهجة مصرية مهذبة وودودة."
        }
      });

      const aiText = response.text || 'عذراً، حدث خطأ ما. حاول مرة أخرى.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'عذراً، واجهت مشكلة في الاتصال. تأكد من إعدادات الـ API.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <motion.button
        layoutId="ai-container"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 left-6 z-[100] w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl text-white border-4 border-white"
      >
        <Bot className="w-8 h-8" />
      </motion.button>
    );
  }

  return (
    <motion.div
      layoutId="ai-container"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-24 left-6 right-6 md:left-auto md:right-6 md:w-[400px] h-[600px] z-[100] bg-white rounded-[32px] shadow-2xl border border-[var(--border)] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <header className={`p-4 flex justify-between items-center transition-colors duration-500 ${isDangerousMode ? 'bg-rose-600 text-white' : 'bg-primary text-white'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            {isDangerousMode ? <Flame className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-black text-sm">كفراوي AI</h3>
            <p className="text-[10px] opacity-80 font-bold">{isDangerousMode ? 'الوضع الخطير مفعل 🔥' : 'المساعد الذكي'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDangerousMode(!isDangerousMode)}
            className={`p-2 rounded-xl transition-all ${isDangerousMode ? 'bg-white text-rose-600' : 'bg-white/20 text-white'}`}
          >
            <Flame className="w-4 h-4" />
          </button>
          <button onClick={() => setIsMinimized(true)} className="p-2 rounded-xl bg-white/20 text-white">
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
              msg.role === 'user' 
                ? 'bg-white text-[var(--text-main)] rounded-tr-none' 
                : isDangerousMode 
                  ? 'bg-rose-600 text-white rounded-tl-none' 
                  : 'bg-primary text-white rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span className="text-[10px]">{msg.role === 'user' ? 'أنت' : 'كفراوي AI'}</span>
              </div>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className={`p-4 rounded-2xl rounded-tl-none flex items-center gap-2 ${isDangerousMode ? 'bg-rose-600/20 text-rose-600' : 'bg-primary/20 text-primary'}`}>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اسأل كفراوي AI..." 
              className="w-full bg-slate-100 rounded-2xl py-3 pr-4 pl-12 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary transition-all">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-2xl transition-all shadow-lg ${
              isDangerousMode 
                ? 'bg-rose-600 text-white shadow-rose-200' 
                : 'bg-primary text-white shadow-primary/20'
            } disabled:opacity-50 disabled:shadow-none`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default KafrawyAI;
