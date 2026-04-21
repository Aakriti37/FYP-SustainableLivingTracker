// pages/User/components/EcoSuggestions/EcoChatbot.tsx

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Leaf } from "lucide-react";
import api from "../../../../services/api";

interface Message {
  role:    "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "How can I reduce my carbon footprint?",
  "What are the best eco-friendly habits?",
  "How does diet affect carbon emissions?",
  "Tips to save energy at home?",
];

const EcoChatbot = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm EcoBot 🌿 Ask me anything about carbon footprints, eco habits, or sustainability!" },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMessage: Message = { role: "user", content: text };
    const updatedHistory = [...messages, userMessage];
    
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);
    
    try {
      const response = await api.post("/eco-suggestions/chat", {
        message: text,
        conversationHistory: messages.slice(1),
      });

      setMessages(prev => [...prev, { role: "assistant", content: response.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #022202, #17921f)' }}
          title="Ask EcoBot"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border"
          style={{ height: "520px", borderColor: '#c5e3a0' }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0"
            style={{ background: 'linear-gradient(135deg, #022202, #17921f)' }}
          >
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Leaf size={16} />
              </div>

              <div>
                <p className="font-bold text-sm leading-none">EcoBot</p>
                
                <p className="text-xs mt-0.5" style={{ color: '#a8d080' }}>Eco Sustainability Assistant</p>
              </div>

            </div>

            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ background: '#f9fef5' }}>
            
            {messages.map((msg, i) => (
              
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: '#d4edaa' }}>
                    <Leaf size={12} style={{ color: '#2d6a10' }} />
                  </div>
                )}

                <div
                  className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: '#508C12', color: 'white', borderBottomRightRadius: '4px' }
                    : { background: 'white', color: '#022202', border: '1px solid #c5e3a0', borderBottomLeftRadius: '4px' }
                  }
                >
                  {msg.content}
                </div>

              </div>
            ))}


            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: '#d4edaa' }}>
                  <Leaf size={12} style={{ color: '#2d6a10' }} />
                </div>

                <div className="px-4 py-3 rounded-2xl" style={{ background: 'white', border: '1px solid #c5e3a0' }}>
                  <Loader2 size={16} className="animate-spin" style={{ color: '#508C12' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 border-t flex flex-wrap gap-1.5 shrink-0" style={{ borderColor: '#c5e3a0', background: 'white' }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-2.5 py-1.5 rounded-full border font-medium transition-colors"
                  style={{ background: '#f0f7e6', color: '#2d6a10', borderColor: '#c5e3a0' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#d4edaa')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#f0f7e6')}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t px-3 py-3 flex gap-2 shrink-0" style={{ borderColor: '#c5e3a0', background: 'white' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask about eco tips..."
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none border disabled:opacity-60"
              style={{ borderColor: '#c5e3a0' }}
              onFocus={e  => (e.target.style.borderColor = '#508C12')}
              onBlur={e   => (e.target.style.borderColor = '#c5e3a0')}
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-40"
              style={{ background: '#508C12' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#3f7708')}
              onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
            >
              <Send size={15} />
            </button>
            
          </div>
        </div>
      )}
    </>
  );
};

export default EcoChatbot;
