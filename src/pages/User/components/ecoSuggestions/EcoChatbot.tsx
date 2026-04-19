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
    {
      role:    "assistant",
      content: "Hi! I'm EcoBot 🌿 Ask me anything about carbon footprints, eco habits, or sustainability!",
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
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
        message:             text,
        conversationHistory: messages.slice(1), // exclude initial greeting
      });

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role:    "assistant",
          content: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating chat button ────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
          title="Ask EcoBot"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* ── Chat window ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf size={16} />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">EcoBot</p>
                <p className="text-emerald-100 text-xs mt-0.5">Eco Sustainability Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1 mr-2">
                    <Leaf size={12} className="text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white rounded-br-sm"
                      : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1 mr-2">
                  <Leaf size={12} className="text-emerald-600" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <Loader2 size={16} className="animate-spin text-emerald-500" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions (show only at start) */}
          {messages.length <= 1 && (
            <div className="bg-white px-3 py-2 border-t border-gray-100 flex flex-wrap gap-1.5 shrink-0">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-3 py-3 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about eco tips..."
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:opacity-60"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-40 transition-colors shrink-0"
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
