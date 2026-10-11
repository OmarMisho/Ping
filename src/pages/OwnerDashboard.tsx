import React, { useState } from 'react';
import OwnerChats from './OwnerChats';
import SettingsPage from './SettingsPage';
import BrandMark from '../components/BrandMark';

type Tab = 'chats' | 'settings';

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');

  return (
    <div className="min-h-screen bg-chrome flex flex-col">
      {/* Top Bar - App Style */}
      <div className="bg-white border-b border-line px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandMark size={32} />
            <h1 className="font-bold text-lg text-ink">Founder</h1>
          </div>
          <span className="text-xs bg-founder-soft text-founder-deep px-2 py-1 rounded-full font-semibold">
            Owner Mode
          </span>
        </div>
      </div>

      {/* Desktop Sidebar + Content */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-line">
          <div className="p-6 border-b border-line">
            <div className="flex items-center gap-3">
              <BrandMark size={48} />
              <div>
                <h1 className="font-bold text-ink text-lg">Founder</h1>
                <p className="text-xs text-ink-muted">Owner Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveTab('chats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'chats'
                  ? 'bg-founder-soft text-founder-deep'
                  : 'text-ink-muted hover:bg-chrome'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Received Chats
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-founder-soft text-founder-deep'
                  : 'text-ink-muted hover:bg-chrome'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings & Contacts
            </button>
          </nav>

          {/* Bottom info */}
          <div className="p-4 border-t border-line">
            <div className="bg-chrome rounded-xl p-4">
              <p className="text-xs text-ink-muted">Founder v1.0</p>
              <p className="text-xs text-ink-muted mt-1">Built with Flutter for iOS & Android</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {activeTab === 'chats' && <OwnerChats />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-white border-t border-line">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 flex flex-col items-center py-3 ${
              activeTab === 'chats' ? 'text-founder-deep' : 'text-ink-muted'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs mt-1 font-medium">Chats</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center py-3 ${
              activeTab === 'settings' ? 'text-founder-deep' : 'text-ink-muted'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1 font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
