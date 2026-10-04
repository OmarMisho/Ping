export interface Message {
  id: string;
  sender: 'user' | 'owner';
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  ownerUid: string;
  ownerId: string;
  qrId: string;
  qrName: string;
  qrType: string;
  visitorId: string;
  userName: string;
  messages: Message[];
  lastMessage: string;
  lastUpdated: number;
  unread: boolean;
  unreadCount: number;
  visitorMessageCount: number;
  createdAt: number;
  expiresAt: number;
}

export interface QrCode {
  qrId: string;
  ownerUid: string;
  ownerId: string;
  name: string;
  type: string;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface AppSettings {
  ownerName: string;
  emergencyMessage: string;
  contacts: EmergencyContact[];
  autoReply: boolean;
  autoReplyMessage: string;
  notificationsEnabled: boolean;
}
