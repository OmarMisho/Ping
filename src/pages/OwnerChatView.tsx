import React, { useEffect, useRef, useState } from 'react';
import { ChatSession, Message } from '../types';
import { listenToMessages, sendMessageAsOwner } from '../services/firebaseService';

interface OwnerChatViewProps {
  chat: ChatSession;
  onBack: () => void;
  onRefresh: () => void;
}

const OwnerChatView: React.FC<OwnerChatViewProps> = ({ chat, onBack, onRefresh }) => {
  const [messages, setMessages] = useState<Message[]>(chat.messages || []);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = listenToMessages(
      chat.id,
      (updatedMessages) => {
        setMessages(updatedMessages);
        onRefresh();
      },
      (listenError) => {
        console.error('Failed to load messages:', listenError);
        setError('Unable to load messages.');
      }
    );
    return unsubscribe;
  }, [chat.id, onRefresh]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    try {
      setSending(true);
      setError('');
      await sendMessageAsOwner(chat.id, text);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-chrome rounded-full transition-colors" title="Back">
          <svg className="w-5 h-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="w-10 h-10 bg-founder text-ink rounded-full flex items-center justify-center font-bold">
          {chat.userName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-ink truncate">{chat.userName}</h2>
          <p className="text-xs text-founder-deep truncate">{chat.qrName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-chrome">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender === 'owner' ? 'bg-founder text-ink rounded-br-md' : 'bg-white text-ink shadow-sm rounded-bl-md'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'owner' ? 'text-ink/55' : 'text-ink-muted'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
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

      {error && <div className="px-4 pb-2 text-center text-sm text-red-600">{error}</div>}

      <div className="bg-white border-t px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your reply..."
            disabled={sending}
            className="flex-1 px-4 py-3 bg-chrome rounded-full text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-founder-deep disabled:opacity-60"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || sending}
            className="w-11 h-11 bg-founder text-ink rounded-full flex items-center justify-center hover:brightness-95 transition disabled:opacity-50"
            title="Send"
          >
            {sending ? (
              <span className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerChatView;
