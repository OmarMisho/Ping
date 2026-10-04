import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, Message } from '../types';
import {
  listenToMessages,
  sendMessageAsOwner,
} from '../services/firebaseService';

interface OwnerChatViewProps {
  chat: ChatSession;
  onBack: () => void;
  onRefresh: () => void;
}

const OwnerChatView: React.FC<OwnerChatViewProps> = ({
  chat,
  onBack,
  onRefresh,
}) => {
  const [messages, setMessages] = useState<Message[]>(chat.messages || []);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to Firebase messages in real time
  useEffect(() => {
    const unsubscribe = listenToMessages(chat.id, (updatedMessages) => {
      setMessages(updatedMessages);
      onRefresh();
    });

    return unsubscribe;
  }, [chat.id, onRefresh]);

  // Scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  // Send owner reply
  const handleSend = async () => {
    const text = input.trim();

    if (!text || sending) return;

    try {
      setSending(true);

      await sendMessageAsOwner(chat.id, text);

      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  // Send with Enter
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
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
          title="Back"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
          {chat.userName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">
            {chat.userName}
          </h2>

          <p className="text-xs text-gray-400">
            Emergency Chat
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'owner'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.sender === 'owner'
                    ? 'bg-red-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">
                  {msg.text}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'owner'
                      ? 'text-red-200'
                      : 'text-gray-400'
                  }`}
                >
                  {new Date(
                    msg.timestamp
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
            onKeyDown={handleKeyPress}
            placeholder="Type your reply..."
            disabled={sending}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-60"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-11 h-11 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50"
            title="Send"
          >
            {sending ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerChatView;