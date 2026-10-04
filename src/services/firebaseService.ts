import { db, isFirebaseConfigured } from '../firebase';
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
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { Message, ChatSession } from '../types';

// ============================================
// FIREBASE-BASED CHAT SERVICE
// Use this when Firebase is configured
// ============================================

export function listenToChats(
  ownerId: string,
  callback: (chats: ChatSession[]) => void
): () => void {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured.');
    return () => {};
  }

  const q = query(
    collection(db, 'chats'),
    where('ownerId', '==', ownerId),
    orderBy('lastUpdated', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const chats: ChatSession[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        userName: data.userName || 'Anonymous',
        messages: [],
        lastMessage: data.lastMessage || '',
        lastUpdated: data.lastUpdated?.toDate?.()?.getTime() || Date.now(),
        unread: data.unread || false,
      };
    });

    callback(chats);
  });

  return unsubscribe;
}

export function listenToMessages(
  chatId: string,
  callback: (messages: Message[]) => void
): () => void {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Using localStorage fallback.');
    return () => {};
  }

  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        sender: data.sender || 'user',
        text: data.text || '',
        timestamp: data.timestamp?.toDate?.()?.getTime() || Date.now(),
      };
    });
    callback(messages);
  });

  return unsubscribe;
}

export async function sendMessageAsUser(
  chatId: string,
  text: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    text,
    sender: 'user',
    timestamp: serverTimestamp(),
  });

  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    lastUpdated: serverTimestamp(),
    unread: true,
  });
}

export async function sendMessageAsOwner(
  chatId: string,
  text: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    text,
    sender: 'owner',
    timestamp: serverTimestamp(),
  });

  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    lastUpdated: serverTimestamp(),
    unread: false,
  });
}

export async function createChatSession(
  ownerId: string,
  visitorId: string
): Promise<string> {
  if (!isFirebaseConfigured()) return '';

  const chatRef = await addDoc(collection(db, 'chats'), {
    ownerId,
    visitorId,
    userName: 'Anonymous',
    lastMessage: '',
    lastUpdated: serverTimestamp(),
    unread: false,
  });

  return chatRef.id;
}

export async function markChatAsRead(chatId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  await updateDoc(doc(db, 'chats', chatId), {
    unread: false,
  });
}

export async function deleteChat(chatId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  // Delete messages
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const messagesSnapshot = await getDocs(messagesRef);
  for (const msgDoc of messagesSnapshot.docs) {
    await deleteDoc(msgDoc.ref);
  }

  // Delete chat
  await deleteDoc(doc(db, 'chats', chatId));
}
