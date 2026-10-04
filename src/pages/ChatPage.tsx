import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { useParams } from 'react-router-dom';
import {
  isFirebaseConfigured,
  signInAnonymousUser,
} from '../firebase';
import {
  listenToMessages,
  sendMessageAsUser,
  createChatSession,
} from '../services/firebaseService';

const ChatPage: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();

  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState('');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const useFirebase = isFirebaseConfigured();

  /*
   * Start the actual chat only after
   * the visitor presses START CHAT.
   */
const handleStartChat = async () => {
  if (!ownerId || starting || chatId) {
    return;
  }

  try {
    setStarting(true);
    setError('');

    // Sign the visitor in anonymously with Firebase
    const user = await signInAnonymousUser();

    // Firebase UID becomes the visitor identity
    const visitorId = user.uid;

    const id = await createChatSession(
      ownerId,
      visitorId
    );

    if (!id) {
      throw new Error('Failed to create chat.');
    }

    setChatId(id);
    setStarted(true);

    const unsubscribe = listenToMessages(
      id,
      (updatedMessages) => {
        setMessages(updatedMessages);
      }
    );

    (window as any).__safeReachUnsubscribe = unsubscribe;
  } catch (err) {
    console.error('Failed to start chat:', err);
    setError('Unable to start the chat. Please try again.');
  } finally {
    setStarting(false);
  }
};

  /*
   * Clean up Firebase listener when leaving
   * the page.
   */
  useEffect(() => {
    return () => {
      const unsubscribe = (window as any).__safeReachUnsubscribe;

      if (unsubscribe) {
        unsubscribe();
        delete (window as any).__safeReachUnsubscribe;
      }
    };
  }, []);

  /*
   * Scroll to newest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  /*
   * Send visitor message.
   */
  const handleSend = async () => {
    const text = input.trim();

    if (!text || !chatId) {
      return;
    }

    try {
      setError('');

      await sendMessageAsUser(chatId, text);

      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Message could not be sent. Please try again.');
    }
  };

  /*
   * Send message with Enter.
   */
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  /*
   * Firebase unavailable.
   */
  if (!useFirebase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">⚠️</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Service Unavailable
          </h2>

          <p className="text-gray-500 mt-2">
            The emergency messaging service is not currently
            connected.
          </p>
        </div>
      </div>
    );
  }

  /*
   * Invalid QR / owner link.
   */
  if (!ownerId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">⚠️</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Invalid Emergency Link
          </h2>

          <p className="text-gray-500 mt-2">
            This emergency contact link is missing an owner ID.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * SCREEN 1 — WELCOME
   * =====================================================
   */
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-5">
        <div className="w-full max-w-md text-center">
          {/* Temporary SafeReach Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 bg-red-600 rounded-[2rem] shadow-xl flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h8M12 8v8"
                  />
                </svg>
              </div>

              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center">
                <div className="w-5 h-5 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            SafeReach
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Emergency Contact
          </p>

          {/* Main Message */}
          <div className="mt-12 px-4">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight">
              In case of any emergency,
              <br />
              <span className="text-red-600">
                text me.
              </span>
            </h2>

            <p className="text-gray-500 mt-5 leading-relaxed">
              You can contact me directly through this
              secure anonymous chat.
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartChat}
            disabled={starting}
            className="w-full mt-10 bg-red-600 text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-red-200 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {starting ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-6 h-6 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              'START CHAT'
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-xs text-gray-400 mt-5">
            No name or personal information is required.
          </p>

          {error && (
            <p className="text-sm text-red-600 mt-4">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * SCREEN 2 — MESSENGER
   * =====================================================
   */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Messenger Header */}
      <div className="bg-red-600 text-white px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {/* Logo */}
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6-8 10-8 10z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h8M12 8v8"
              />
            </svg>
          </div>

          <div>
            <h1 className="font-semibold text-lg">
              SafeReach
            </h1>

            <p className="text-red-100 text-sm">
              Emergency Contact
            </p>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

            <span className="text-sm text-red-100">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender === 'user'
                  ? 'flex justify-end'
                  : 'flex justify-start'
              }
            >
              <div
                className={
                  msg.sender === 'user'
                    ? 'max-w-[80%] px-4 py-2 rounded-2xl bg-red-600 text-white rounded-br-md'
                    : 'max-w-[80%] px-4 py-2 rounded-2xl bg-white text-gray-800 shadow-md rounded-bl-md'
                }
              >
                <p className="text-sm leading-relaxed">
                  {msg.text}
                </p>

                <p
                  className={
                    msg.sender === 'user'
                      ? 'text-xs mt-1 text-red-200'
                      : 'text-xs mt-1 text-gray-400'
                  }
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

      {/* Error */}
      {error && (
        <div className="px-4 pb-2">
          <div className="max-w-lg mx-auto text-center text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3 shadow-inner">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={!chatId}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-60"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || !chatId}
            className="w-11 h-11 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send"
          >
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

