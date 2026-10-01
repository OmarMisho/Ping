import { ChatSession, AppSettings } from './types';

const CHATS_KEY = 'saferch_chats';
const SETTINGS_KEY = 'saferch_settings';

export function getChats(): ChatSession[] {
  const data = localStorage.getItem(CHATS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveChats(chats: ChatSession[]): void {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function getSettings(): AppSettings {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (data) return JSON.parse(data);
  return {
    ownerName: 'Account Owner',
    emergencyMessage: 'In case of any emergency, text me',
    contacts: [],
    autoReply: true,
    autoReplyMessage: 'Thank you for reaching out. I will respond as soon as possible.',
    notificationsEnabled: true,
  };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
