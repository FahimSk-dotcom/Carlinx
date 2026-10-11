import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, RotateCcw, Bot } from 'lucide-react';

const STORAGE_KEY = 'carlinx_chat_messages';

export default function GeminiChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef(null);

  // Restore saved conversation from localStorage on client mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load chat history from localStorage:', err);
    }
  }, []);

  // Persist conversation to localStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to save chat history to localStorage:', err);
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear chat storage:', err);
    }
  };

  const sendMessageWithText = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const newMessage = { role: 'user', text: trimmed };
    const priorHistory = [...messages];
    const updatedMessages = [...priorHistory, newMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory
        })
      });

      const data = await res.json();
      const replyText = data.reply || 'Sorry, I did not receive a response. Please try again.';

      setMessages(prev => [...prev, { role: 'ai', text: replyText }]);
    } catch (error) {
      console.error('Error contacting Gemini:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: 'Sorry, I encountered an error connecting to the assistant. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendMessageWithText(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionPrompts = [
    'I want to buy a car',
    'How do I book a test drive?',
    'How can I sell my vehicle?',
    'What spare parts do you sell?'
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 font-sans">
      {/* Floating Trigger Button */}
      <div className="relative">
        <button
          aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
          className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl hover:opacity-90 active:scale-95 transition-all duration-200"
          onClick={toggleChat}
          onMouseEnter={() => !isOpen && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <MessageCircle size={26} />
          )}
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shadow-lg">
            Chat with Carlinx AI
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-84 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-[#EF1D26] text-white p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Carlinx Assistant</h3>
                <span className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  Active &bull; Context Aware
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button
                onClick={toggleChat}
                aria-label="Close"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            id="chat-messages"
            className="p-4 h-80 sm:h-96 max-h-[calc(100vh-220px)] overflow-y-auto flex flex-col gap-3 bg-gray-50/50"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-2 py-6 my-auto">
                <div className="w-12 h-12 rounded-full bg-red-50 text-accent flex items-center justify-center mb-3">
                  <Bot size={24} />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Welcome to Carlinx!</h4>
                <p className="text-gray-500 text-xs mb-4">
                  Ask me about buying cars, selling your vehicle, booking test drives, or spare parts.
                </p>

                <div className="flex flex-col gap-2 w-full">
                  {suggestionPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessageWithText(prompt)}
                      className="text-left text-xs bg-white hover:bg-red-50 hover:text-accent border border-gray-200 hover:border-red-200 text-gray-700 px-3 py-2 rounded-xl transition-all shadow-sm"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-br-xs'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-600 px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-2 text-xs shadow-sm">
                  <Loader2 className="animate-spin text-accent" size={14} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-3 bg-white flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about cars, parts, services..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none h-10 max-h-24 leading-snug"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className={`p-2.5 rounded-xl transition-all ${
                isLoading || !input.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-accent text-white hover:opacity-90 active:scale-95 shadow-md'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}