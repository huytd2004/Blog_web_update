import { useState } from 'react';
import { BiMessageDetail, BiX } from 'react-icons/bi'; 
import { Info } from '../utils/Info';

const Chatbot = () => {
  //Khởi tạo state
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isOpen, setIsOpen] = useState(false); 
  const [chatHistory, setChatHistory] = useState([]); // State để lưu lịch sử chat

  // System context for the chatbot
  const systemContext = `You are a helpful AI assistant for Blog Web. Use the following information to answer customer queries accurately and professionally. Always be friendly and welcoming. If you don't know something specific, be honest about it.

${Info}

Remember to:
1. Be concise but informative
2. Use a friendly, professional tone
3. Provide specific details from the menu when relevant
4. Include business hours and contact information when appropriate
5. Suggest relevant menu items when applicable`;

  //Xử lý submit
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Cập nhật lịch sử chat
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ 
          contents: [
            // Nếu là tin nhắn đầu tiên, gửi kèm systemContext
            {
              role: "model",
              parts: [{
                text: systemContext
              }]
            },
            {
              role: "user",
              parts: [{
                text: input
              }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        })
      });

      const data = await response.json(); //Lấy dữ liệu từ API
      console.log('API Response:', data); 
      
      let assistantContent = 'Sorry, I could not generate a response.';
      
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
        assistantContent = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        assistantContent = `Error: ${data.error.message || 'Unknown error occurred'}`;
        console.error('API Error:', data.error);
      }

      const assistantMessage = {
        role: 'assistant',
        content: assistantContent
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
      >
        {isOpen ? (
          <BiX className="w-8 h-8" />
        ) : (
          <BiMessageDetail className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-black/90 backdrop-blur-xl rounded-lg shadow-xl border border-gray-800 text-white animate-fade-up">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white"> AI Assistant</h3>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start' //Nếu message là người dùng thì căn phải, ngược lại thì căn trái
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg text-white">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 