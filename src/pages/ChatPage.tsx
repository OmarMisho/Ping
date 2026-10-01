import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getChats, saveChats, getSettings, generateId } from '../storage';
import { isFirebaseConfigured } from '../firebase';
import {
  listenToMessages,
  sendMessageAsUser,
  createChatSession,
} from '../services/firebaseService';

interface ChatPageProps {
  sessionId?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const [chatId, setChatId] = useState(sessionId || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const settings = getSettings();
  const useFirebase = isFirebaseConfigured();

  useEffect(() => {
    if (sessionId) {
      if (useFirebase) {
        const unsubscribe = listenToMessages(sessionId, (msgs) => {
          setMessages(msgs);
        });
        setNameSet(true);
        setChatId(sessionId);
        return () => unsubscribe();
      } else {
        const chats = getChats();
        const existing = chats.find(c => c.id === sessionId);
        if (existing) {
          setMessages(existing.messages);
          setUserName(existing.userName);
          setNameSet(true);
          setChatId(sessionId);
        }
      }
    }
  }, [sessionId, useFirebase]);

  // Poll for new messages from owner (localStorage fallback)
  useEffect(() => {
    if (!chatId || useFirebase) return;
    const interval = setInterval(() => {
      const chats = getChats();
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setMessages(chat.messages);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [chatId, useFirebase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async () => {
    if (!userName.trim()) return;

    if (useFirebase) {
      // Firebase mode
      const id = await createChatSession(
        userName.trim(),
        settings.autoReplyMessage || 'Thank you for reaching out. I will respond as soon as possible.'
      );
      setChatId(id);
      setNameSet(true);

      // Listen for messages
      const unsubscribe = listenToMessages(id, (msgs) => {
        setMessages(msgs);
      });
      return () => unsubscribe();
    } else {
      // localStorage fallback
      const id = generateId();
      setChatId(id);
      setNameSet(true);

      const initialMessage: Message = {
        id: generateId(),
        sender: 'owner',
        text: settings.autoReplyMessage || 'Thank you for reaching out. I will respond as soon as possible.',
        timestamp: Date.now(),
      };

      const newChat = {
        id,
        userName: userName.trim(),
        messages: [initialMessage],
        lastMessage: initialMessage.text,
        lastUpdated: Date.now(),
        unread: true,
      };

      const chats = getChats();
      chats.unshift(newChat);
      saveChats(chats);
      setMessages([initialMessage]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    if (useFirebase) {
      await sendMessageAsUser(chatId, input.trim());
      setInput('');
    } else {
      const newMsg: Message = {
        id: generateId(),
        sender: 'user',
        text: input.trim(),
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setInput('');

      const chats = getChats();
      const chatIndex = chats.findIndex(c => c.id === chatId);
      if (chatIndex !== -1) {
        chats[chatIndex].messages = updatedMessages;
        chats[chatIndex].lastMessage = newMsg.text;
        chats[chatIndex].lastUpdated = Date.now();
        chats[chatIndex].unread = true;
        saveChats(chats);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!nameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Start Emergency Chat</h2>
            <p className="text-gray-500 mt-2">Please enter your name to begin</p>
          </div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
            placeholder="Your name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-lg"
            autoFocus
          />
          <button
            onClick={handleStartChat}
            className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            Start Chat
          </button>
          {useFirebase && (
            <p className="text-center text-xs text-green-600 mt-3">🟢 Connected to Firebase (Real-time)</p>
          )}
          {!useFirebase && (
            <p className="text-center text-xs text-amber-600 mt-3">🟡 Using local storage (Demo mode)</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-red-600 text-white px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-lg">{settings.ownerName}</h1>
            <p className="text-red-100 text-sm">Emergency Contact</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full animate-pulse ${useFirebase ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            <span className="text-sm text-red-100">{useFirebase ? 'Live' : 'Demo'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-red-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-red-200' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3 shadow-inner">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ChatPage;
