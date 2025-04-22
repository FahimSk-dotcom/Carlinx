import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

export default function GeminiChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage = { role: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans">
      {/* Chat button */}
      <div className="relative">
        <button
          className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg hover:bg-red-800 transition-colors duration-200"
          onClick={toggleChat}
          onMouseEnter={() => !isOpen && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isOpen ? (
            <X className="text-white" size={24} />
          ) : (
            <MessageCircle className="text-white" size={24} />
          )}
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
            Ask Assistant
          </div>
        )}
      </div>

      {/* Chat sidebar */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="bg-accent text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Carlinx Assistant</h3>
            <X 
              className="cursor-pointer hover:text-gray-200" 
              size={20} 
              onClick={toggleChat}
            />
          </div>
          
          {/* Messages container */}
          <div 
            id="chat-messages"
            className="p-4 h-96 overflow-y-auto flex flex-col gap-3"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-32">
                <p>Ask me anything about cars or parts!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-accent text-white rounded-br-none' 
                        : 'bg-black text-white rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none flex items-center">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="ml-2">Thinking...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t p-3 flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about a car or part..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none h-10 max-h-32"
              rows={1}
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={`ml-2 p-2 rounded-full ${
                isLoading || !input.trim() 
                  ? 'bg-accent text-white cursor-not-allowed' 
                  : 'bg-accent text-white hover:bg-blue-700'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}