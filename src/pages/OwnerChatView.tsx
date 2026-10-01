import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, Message } from '../types';
import { getChats, saveChats, generateId } from '../storage';

interface OwnerChatViewProps {
  chat: ChatSession;
  onBack: () => void;
  onRefresh: () => void;
}

const OwnerChatView: React.FC<OwnerChatViewProps> = ({ chat, onBack, onRefresh }) => {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages from user
  useEffect(() => {
    const interval = setInterval(() => {
      const chats = getChats();
      const updated = chats.find(c => c.id === chat.id);
      if (updated) {
        setMessages(updated.messages);
        onRefresh();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [chat.id, onRefresh]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: generateId(),
      sender: 'owner',
      text: input.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');

    // Update chat in storage
    const chats = getChats();
    const chatIndex = chats.findIndex(c => c.id === chat.id);
    if (chatIndex !== -1) {
      chats[chatIndex].messages = updatedMessages;
      chats[chatIndex].lastMessage = newMsg.text;
      chats[chatIndex].lastUpdated = Date.now();
      saveChats(chats);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
          {chat.userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">{chat.userName}</h2>
          <p className="text-xs text-gray-400">Emergency Chat</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.sender === 'owner'
                    ? 'bg-red-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'owner' ? 'text-red-200' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your reply..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerChatView;
