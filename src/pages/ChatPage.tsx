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
import AppHeader from '../components/AppHeader';
import BrandMark from '../components/BrandMark';
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  MessageCircleIcon,
  ScanLineIcon,
  SendIcon,
  SpinnerIcon,
  UserRoundIcon,
} from '../components/icons';

const MAX_VISITOR_MESSAGES = 10;

/** Fixed arrival headline. Not driven by the QR. Each line is sized to fill the column. */
const ARRIVAL_LINE_1 = 'Thank you for finding me! 💛';
const ARRIVAL_LINE_2 = 'Please help me find my way back to my owner.';

const ErrorScreen: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-5">
    <div className="bg-white rounded-[20px] border border-line p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-founder-soft rounded-[20px] flex items-center justify-center mx-auto mb-5">
        <AlertTriangleIcon className="w-8 h-8 text-founder-deep" />
      </div>
      <h2 className="text-[19px] font-bold text-ink">{title}</h2>
      <p className="text-ink-muted mt-2 text-sm">{message}</p>
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
          setError('This QR code is invalid or inactive.');
        } else {
          setQr(result);
        }
      } catch (err) {
        console.error('Failed to load QR code:', err);
        if (!cancelled) {
          setError('Unable to verify this QR code.');
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
        message="The private messaging service is not currently connected."
      />
    );
  }

  if (loadingQr) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-[20px] bg-founder flex items-center justify-center animate-pulse-soft">
          <ScanLineIcon className="w-8 h-8 text-ink" />
        </div>
        <p className="text-ink-muted text-sm">Verifying QR code…</p>
      </div>
    );
  }

  if (!ownerId || !qrId) {
    return (
      <ErrorScreen
        title="Invalid Link"
        message="This Founder QR link is incomplete."
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
        message="This QR code could not be verified."
      />
    );
  }

  /* ------------------------------------------------------------------ *
   * Arrival screen — Figma "Finder browser · QR arrival" (2:19097)
   * ------------------------------------------------------------------ */
  if (!started) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AppHeader />

        <main className="flex-1 overflow-y-auto px-6 pb-10">
          <div className="max-w-[430px] mx-auto">
            {/* Finder introduction */}
            <section className="flex flex-col gap-[22px] pt-1">
              <div className="w-16 h-16 rounded-[20px] bg-founder flex items-center justify-center">
                <ScanLineIcon className="w-8 h-8 text-ink" />
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-xs font-bold tracking-[0.07em] text-founder-deep">
                  YOU SCANNED A FOUNDER QR
                </p>
                <h1 className="font-bold leading-[1.15] text-ink">
                  <span className="block text-[min(26.5px,calc((100vw_-_48px)/14.4))]">
                    {ARRIVAL_LINE_1}
                  </span>
                  <span className="block text-[min(16.6px,calc((100vw_-_48px)/23))]">
                    {ARRIVAL_LINE_2}
                  </span>
                </h1>
                <p className="text-[15px] leading-[1.45] text-ink-muted">
                  Send a text to its owner and help their belongings find a way
                  home.
                </p>
              </div>

              <div className="rounded-[20px] border border-line bg-white p-[18px] flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <UserRoundIcon className="w-[23px] h-[23px] text-ink flex-shrink-0" />
                  <p className="text-[15px] font-semibold text-ink">
                    Chat with the anonymous owner
                  </p>
                </div>
                <p className="text-xs leading-[1.45] text-ink-muted">
                  No name, phone number, or contact details are shown. Just a
                  private text conversation.
                </p>
              </div>

              <div className="rounded-[14px] bg-founder-soft p-3.5 flex gap-2.5">
                <MessageCircleIcon className="w-[18px] h-[18px] text-ink-muted flex-shrink-0 mt-px" />
                <p className="text-xs leading-[1.45] text-ink-muted">
                  You can send {MAX_VISITOR_MESSAGES} messages to this owner in
                  total. This allowance never resets.
                </p>
              </div>
            </section>

            {/* Finder routes */}
            <section className="flex flex-col gap-3.5 mt-4">
              <button
                type="button"
                onClick={handleStartChat}
                disabled={starting}
                className="h-[54px] rounded-[14px] bg-founder border border-white flex items-center justify-center gap-2.5 text-[15px] font-semibold text-ink transition hover:brightness-[0.97] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {starting ? (
                  <>
                    <SpinnerIcon className="w-5 h-5" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <MessageCircleIcon className="w-5 h-5" />
                    Start text chat
                  </>
                )}
              </button>

              <p className="text-xs text-ink-muted">
                Continue here. No sign-in or download needed.
              </p>

              <a
                href="https://founder.app/download"
                target="_blank"
                rel="noreferrer"
                className="rounded-[14px] border border-line px-4 py-2.5 flex items-center gap-3 transition-colors hover:bg-chrome"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">
                    Prefer the app? Download Founder
                  </span>
                  <span className="block text-[11px] text-ink-muted mt-0.5">
                    Optional · The same message allowance applies.
                  </span>
                </span>
                <ArrowUpRightIcon className="w-[19px] h-[19px] text-ink flex-shrink-0" />
              </a>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
            </section>
          </div>
        </main>
      </div>
    );
  }

  /* ------------------------------------------------------------------ *
   * Active chat
   * ------------------------------------------------------------------ */
  const limitReached = visitorMessageCount >= MAX_VISITOR_MESSAGES;
  const remaining = MAX_VISITOR_MESSAGES - visitorMessageCount;

  return (
    <div className="min-h-screen bg-chrome flex flex-col">
      <header className="h-[72px] bg-white border-b border-line flex items-center gap-3 px-6 flex-shrink-0">
        <BrandMark size={36} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[15px] font-semibold text-ink truncate">
            {qr.name}
          </h1>
          <p className="text-xs text-ink-muted truncate">
            Anonymous owner · Private chat
          </p>
        </div>
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-founder animate-pulse" />
          <span className="text-xs text-ink-muted">Live</span>
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-ink-muted pt-8">
              Say hello — your message is private and anonymous.
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}
            >
              <div
                className={
                  msg.sender === 'user'
                    ? 'max-w-[80%] px-4 py-2 rounded-2xl rounded-br-md bg-founder text-ink'
                    : 'max-w-[80%] px-4 py-2 rounded-2xl rounded-bl-md bg-white text-ink shadow-sm'
                }
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={
                    msg.sender === 'user'
                      ? 'text-xs mt-1 text-ink/55'
                      : 'text-xs mt-1 text-ink-muted'
                  }
                >
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

      <div className="bg-white border-t border-line px-4 py-3 pb-safe flex-shrink-0">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={limitReached ? '10-message limit reached' : 'Type your message…'}
              disabled={limitReached}
              className="flex-1 px-4 py-3 bg-chrome rounded-full text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-founder-deep disabled:opacity-60"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || limitReached}
              className="w-11 h-11 bg-founder text-ink rounded-full flex items-center justify-center transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              title="Send"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center text-xs text-ink-muted mt-2">
            {remaining} message{remaining !== 1 ? 's' : ''} remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
