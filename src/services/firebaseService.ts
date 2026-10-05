import { db, auth, isFirebaseConfigured } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
  getDoc,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { Message, ChatSession, QrCode } from '../types';

const CHAT_EXPIRY_DAYS = 14;
const MAX_VISITOR_MESSAGES = 10;

function timestampToMillis(value: unknown, fallback = Date.now()): number {
  if (value && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return ((value as { toDate: () => Date }).toDate()).getTime();
  }
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === 'number') return value;
  return fallback;
}

function mapChat(id: string, data: Record<string, any>): ChatSession {
  return {
    id,
    ownerUid: data.ownerUid || '',
    ownerId: data.ownerId || '',
    qrId: data.qrId || '',
    qrName: data.qrName || 'Emergency QR',
    visitorId: data.visitorId || '',
    userName: data.userName || 'Anonymous',
    messages: [],
    lastMessage: data.lastMessage || '',
    lastUpdated: timestampToMillis(data.lastUpdated),
    unread: Boolean(data.unread),
    unreadCount: Number(data.unreadCount || 0),
    visitorMessageCount: Number(data.visitorMessageCount || 0),
    createdAt: timestampToMillis(data.createdAt),
    expiresAt: timestampToMillis(data.expiresAt, Date.now() + CHAT_EXPIRY_DAYS * 86400000),
  };
}

export async function getQrCode(qrId: string): Promise<QrCode | null> {
  if (!isFirebaseConfigured()) return null;

  const snapshot = await getDoc(doc(db, 'qrCodes', qrId));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    qrId: data.qrId || snapshot.id,
    ownerUid: data.ownerUid || '',
    ownerId: data.ownerId || '',
    name: data.name || 'Emergency QR',
    active: data.active !== false,
    createdAt: timestampToMillis(data.createdAt),
    updatedAt: timestampToMillis(data.updatedAt),
  };
}

export function listenToChats(
  ownerUid: string,
  callback: (chats: ChatSession[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured() || !ownerUid) return () => {};

  const q = query(
    collection(db, 'chats'),
    where('ownerUid', '==', ownerUid),
    orderBy('lastUpdated', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => callback(snapshot.docs.map((item) => mapChat(item.id, item.data()))),
    (error) => onError?.(error)
  );
}

export function listenToMessages(
  chatId: string,
  callback: (messages: Message[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured() || !chatId) return () => {};

  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            sender: data.sender === 'owner' ? 'owner' : 'user',
            text: data.text || '',
            timestamp: timestampToMillis(data.timestamp),
          };
        })
      );
    },
    (error) => onError?.(error)
  );
}

export async function createChatSession(
  ownerUid: string,
  ownerId: string,
  qrId: string,
  qrName: string,
  visitorId: string
): Promise<string> {
  if (!isFirebaseConfigured()) return '';

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  const chatRef = await addDoc(collection(db, 'chats'), {
    ownerUid,
    ownerId,
    qrId,
    qrName,              // ← CAR
    visitorId,
    userName: 'Anonymous',
    lastMessage: '',
    lastUpdated: serverTimestamp(),
    unread: false,
    unreadCount: 0,
    visitorMessageCount: 0,
    createdAt: serverTimestamp(),
    expiresAt,
  });

  return chatRef.id;
}

export async function sendMessageAsUser(chatId: string, text: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase is not configured.');

  const cleanText = text.trim();
  const user = auth.currentUser;

  if (!cleanText) throw new Error('Message cannot be empty.');
  if (!user || user.isAnonymous !== true) {
    throw new Error('Visitor authentication is required.');
  }

  const chatRef = doc(db, 'chats', chatId);
  const messageRef = doc(collection(db, 'chats', chatId, 'messages'));

  await runTransaction(db, async (transaction) => {
    const chatSnapshot = await transaction.get(chatRef);
    if (!chatSnapshot.exists()) throw new Error('Chat not found.');

    const data = chatSnapshot.data();
    const expiresAt = data.expiresAt instanceof Timestamp
      ? data.expiresAt.toMillis()
      : timestampToMillis(data.expiresAt);

    if (data.visitorId !== user.uid) throw new Error('You are not allowed to use this chat.');
    if (expiresAt <= Date.now()) throw new Error('This chat has expired.');

    const count = Number(data.visitorMessageCount || 0);
    if (count >= MAX_VISITOR_MESSAGES) {
      throw new Error('You have reached the 10-message limit.');
    }

    transaction.set(messageRef, {
      text: cleanText,
      sender: 'user',
      timestamp: serverTimestamp(),
    });

    transaction.update(chatRef, {
      lastMessage: cleanText,
      lastUpdated: serverTimestamp(),
      unread: true,
      unreadCount: Number(data.unreadCount || 0) + 1,
      visitorMessageCount: count + 1,
    });
  });
}

export async function sendMessageAsOwner(chatId: string, text: string): Promise<void> {
  if (!isFirebaseConfigured()) throw new Error('Firebase is not configured.');

  const cleanText = text.trim();
  if (!cleanText) throw new Error('Message cannot be empty.');

  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Owner authentication is required.');

  const chatRef = doc(db, 'chats', chatId);
  const messageRef = doc(collection(db, 'chats', chatId, 'messages'));

  await runTransaction(db, async (transaction) => {
    const chatSnapshot = await transaction.get(chatRef);
    if (!chatSnapshot.exists()) throw new Error('Chat not found.');

    const data = chatSnapshot.data();
    if (data.ownerUid !== user.uid) throw new Error('You are not allowed to reply to this chat.');

    const expiresAt = timestampToMillis(data.expiresAt, 0);
    if (expiresAt && expiresAt <= Date.now()) throw new Error('This chat has expired.');

    transaction.set(messageRef, {
      text: cleanText,
      sender: 'owner',
      timestamp: serverTimestamp(),
    });

    transaction.update(chatRef, {
      lastMessage: cleanText,
      lastUpdated: serverTimestamp(),
      unread: false,
      unreadCount: 0,
    });
  });
}

export async function markChatAsRead(chatId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Owner authentication is required.');

  await updateDoc(doc(db, 'chats', chatId), {
    unread: false,
    unreadCount: 0,
  });
}

export async function deleteChat(chatId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Owner authentication is required.');

  const chatRef = doc(db, 'chats', chatId);
  const chatSnapshot = await getDoc(chatRef);
  if (!chatSnapshot.exists()) return;

  if (chatSnapshot.data().ownerUid !== user.uid) {
    throw new Error('You are not allowed to delete this chat.');
  }

  const messagesSnapshot = await getDocs(collection(db, 'chats', chatId, 'messages'));
  for (const message of messagesSnapshot.docs) {
    await deleteDoc(message.ref);
  }

  await deleteDoc(chatRef);
}
