import React, { useState, useEffect } from 'react';
import { ChatSession } from '../types';
import {
  listenToChats,
  markChatAsRead,
  deleteChat,
} from '../services/firebaseService';
import OwnerChatView from './OwnerChatView';

// Temporary owner ID for testing
const OWNER_ID = 'A8F42K';

const OwnerChats: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);

  // Listen to this owner's chats in real time
  useEffect(() => {
    const unsubscribe = listenToChats(OWNER_ID, (updatedChats) => {
      setChats(updatedChats);

      if (selectedChat) {
        const updatedSelected = updatedChats.find(
          (chat) => chat.id === selectedChat.id
        );

        if (updatedSelected) {
          setSelectedChat(updatedSelected);
        }
      }
    });

    return unsubscribe;
  }, [selectedChat?.id]);

  // Mark chat as read
  const handleMarkRead = async (chatId: string) => {
    await markChatAsRead(chatId);

    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? { ...chat, unread: false }
          : chat
      )
    );

    setSelectedChat((current) =>
      current?.id === chatId
        ? { ...current, unread: false }
        : current
    );
  };

  // Delete chat from Firebase
  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);

      setChats((current) =>
        current.filter((chat) => chat.id !== chatId)
      );

      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  // Open selected chat
  if (selectedChat) {
    return (
      <OwnerChatView
        chat={selectedChat}
        onBack={() => setSelectedChat(null)}
        onRefresh={() => {}}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Received Chats
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          {chats.length} conversation
          {chats.length !== 1 ? 's' : ''}

          {chats.filter((c) => c.unread).length > 0 && (
            <span className="ml-2 text-red-600 font-medium">
              ({chats.filter((c) => c.unread).length} unread)
            </span>
          )}
        </p>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-600">
              No conversations yet
            </h3>

            <p className="text-gray-400 mt-2 text-sm">
              When someone starts a chat through your QR code,
              it will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  chat.unread ? 'bg-red-50/50' : ''
                }`}
                onClick={() => {
                  setSelectedChat(chat);

                  if (chat.unread) {
                    handleMarkRead(chat.id);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      chat.unread
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    {chat.userName.charAt(0).toUpperCase()}
                  </div>

                  {/* Chat information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-semibold truncate ${
                          chat.unread
                            ? 'text-gray-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {chat.userName}
                      </h3>

                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {new Date(
                          chat.lastUpdated
                        ).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p
                      className={`text-sm truncate mt-1 ${
                        chat.unread
                          ? 'text-gray-700 font-medium'
                          : 'text-gray-500'
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {chat.unread && (
                    <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Delete chat"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerChats;