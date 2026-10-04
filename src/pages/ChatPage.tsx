import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Message, QrCode } from '../types';
import { isFirebaseConfigured, signInAnonymousUser } from '../firebase';
import {
  createChatSession,
  getQrCode,
  listenToMessages,
  sendMessageAsUser,
} from '../services/firebaseService';

const MAX_VISITOR_MESSAGES = 10;

const ErrorScreen: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
      <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  </div>
);

const ChatPage: React.FC = () => {
  const { ownerId, qrId } = useParams<{ ownerId: string; qrId: string }>();

  const [started, setStarted] = useState(false);
  const [qr, setQr] = useState<QrCode | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState('');
  const [visitorMessageCount, setVisitorMessageCount] = useState(0);
  const [starting, setStarting] = useState(false);
  const [loadingQr, setLoadingQr] = useState(true);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadQr = async () => {
      if (!qrId || !ownerId || !isFirebaseConfigured()) {
        setLoadingQr(false);
        return;
      }

      try {
        const result = await getQrCode(qrId);

        if (cancelled) return;

        if (
          !result ||
          !result.active ||
          result.ownerId !== ownerId
        ) {
          setError('This emergency QR code is invalid or inactive.');
        } else {
          setQr(result);
        }
      } catch (err) {
        console.error('Failed to load QR code:', err);
        if (!cancelled) {
          setError('Unable to verify this emergency QR code.');
        }
      } finally {
        if (!cancelled) setLoadingQr(false);
      }
    };

    loadQr();

    return () => {
      cancelled = true;
    };
  }, [ownerId, qrId]);

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async () => {
    if (!ownerId || !qrId || !qr || starting || chatId) return;

    try {
      setStarting(true);
      setError('');

      const user = await signInAnonymousUser();

      const id = await createChatSession(
        qr.ownerUid,
        qr.ownerId,
        qr.qrId,
        qr.name,
        user.uid
      );

      setChatId(id);
      setStarted(true);

      unsubscribeRef.current?.();
      unsubscribeRef.current = listenToMessages(id, (updatedMessages) => {
        setMessages(updatedMessages);
      });
    } catch (err) {
      console.error('Failed to start chat:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to start the chat. Please try again.'
      );
    } finally {
      setStarting(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();

    if (!text || !chatId || visitorMessageCount >= MAX_VISITOR_MESSAGES) {
      return;
    }

    try {
      setError('');
      await sendMessageAsUser(chatId, text);
      setInput('');
      setVisitorMessageCount((count) => count + 1);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Message could not be sent. Please try again.'
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isFirebaseConfigured()) {
    return (
      <ErrorScreen
        title="Service Unavailable"
        message="The emergency messaging service is not currently connected."
      />
    );
  }

  if (loadingQr) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-500">Verifying emergency QR code...</div>
      </div>
    );
  }

  if (!ownerId || !qrId) {
    return (
      <ErrorScreen
        title="Invalid Emergency Link"
        message="This emergency contact link is incomplete."
      />
    );
  }

  if (error && !qr) {
    return <ErrorScreen title="QR Code Unavailable" message={error} />;
  }

  if (!qr) {
    return (
      <ErrorScreen
        title="QR Code Unavailable"
        message="This emergency QR code could not be verified."
      />
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-5">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 bg-red-600 rounded-[2rem] shadow-xl flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center">
                <div className="w-5 h-5 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            SafeReach
          </h1>

          <p className="text-red-600 font-semibold mt-2">{qr.name}</p>
          <p className="text-gray-500 text-sm mt-1">Emergency Contact</p>

          <div className="mt-10 px-4">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight">
              In case of any emergency,
              <br />
              <span className="text-red-600">text me.</span>
            </h2>

            <p className="text-gray-500 mt-5 leading-relaxed">
              You can contact the owner through this secure anonymous chat.
            </p>
          </div>

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

          <p className="text-xs text-gray-400 mt-5">
            Anonymous • Maximum 10 messages • Chat expires after 14 days
          </p>

          {error && (
            <p className="text-sm text-red-600 mt-4">{error}</p>
          )}
        </div>
      </div>
    );
  }

  const limitReached = visitorMessageCount >= MAX_VISITOR_MESSAGES;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-red-600 text-white px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 8v8" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-lg">{qr.name}</h1>
            <p className="text-red-100 text-sm">SafeReach Emergency Chat</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-red-100">Live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={msg.sender === 'user'
                ? 'max-w-[80%] px-4 py-2 rounded-2xl bg-red-600 text-white rounded-br-md'
                : 'max-w-[80%] px-4 py-2 rounded-2xl bg-white text-gray-800 shadow-md rounded-bl-md'}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={msg.sender === 'user'
                  ? 'text-xs mt-1 text-red-200'
                  : 'text-xs mt-1 text-gray-400'}>
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

      {error && (
        <div className="px-4 pb-2">
          <div className="max-w-lg mx-auto text-center text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

      <div className="bg-white border-t px-4 py-3 shadow-inner">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={limitReached ? '10-message limit reached' : 'Type your message...'}
              disabled={limitReached}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-60"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || limitReached}
              className="w-11 h-11 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <div className="text-center text-xs text-gray-400 mt-2">
            {MAX_VISITOR_MESSAGES - visitorMessageCount} message
            {MAX_VISITOR_MESSAGES - visitorMessageCount !== 1 ? 's' : ''} remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
