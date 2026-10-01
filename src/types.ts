export interface Message {
  id: string;
  sender: 'user' | 'owner';
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  userName: string;
  messages: Message[];
  lastMessage: string;
  lastUpdated: number;
  unread: boolean;
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
