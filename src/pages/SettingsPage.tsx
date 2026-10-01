import React, { useState, useEffect } from 'react';
import { AppSettings, EmergencyContact } from '../types';
import { getSettings, saveSettings, generateId } from '../storage';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [newContact, setNewContact] = useState<EmergencyContact>({
    id: '',
    name: '',
    phone: '',
    relationship: '',
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'support'>('contacts');

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    const contact: EmergencyContact = {
      ...newContact,
      id: generateId(),
    };
    const updated = {
      ...settings,
      contacts: [...settings.contacts, contact],
    };
    setSettings(updated);
    saveSettings(updated);
    setNewContact({ id: '', name: '', phone: '', relationship: '' });
  };

  const handleRemoveContact = (id: string) => {
    const updated = {
      ...settings,
      contacts: settings.contacts.filter(c => c.id !== id),
    };
    setSettings(updated);
    saveSettings(updated);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your emergency contacts and app settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'contacts'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Emergency Contacts
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'support'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            App Support
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeTab === 'contacts' ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Owner Name */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Your Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={settings.ownerName}
                    onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                    placeholder="Your name as shown to users"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Emergency Message</label>
                  <textarea
                    value={settings.emergencyMessage}
                    onChange={(e) => setSettings({ ...settings, emergencyMessage: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none resize-none"
                    rows={2}
                    placeholder="Message shown on the landing page"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Emergency Contacts
              </h3>

              {/* Existing Contacts */}
              {settings.contacts.length > 0 && (
                <div className="space-y-3 mb-4">
                  {settings.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.phone} • {contact.relationship}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Contact */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-600 mb-3">Add New Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Name"
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none text-sm"
                  />
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Phone number"
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="Relationship"
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={handleAddContact}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  + Add Contact
                </button>
              </div>
            </div>

            {/* Auto Reply */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Auto-Reply Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable Auto-Reply</span>
                  <button
                    onClick={() => setSettings({ ...settings, autoReply: !settings.autoReply })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.autoReply ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings.autoReply ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </label>
                {settings.autoReply && (
                  <textarea
                    value={settings.autoReplyMessage}
                    onChange={(e) => setSettings({ ...settings, autoReplyMessage: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none resize-none text-sm"
                    rows={3}
                    placeholder="Auto-reply message sent to users"
                  />
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              {saved ? '✓ Saved Successfully!' : 'Save All Settings'}
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* App Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About SafeReach
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Platform:</strong> iOS & Android (Built with Flutter)</p>
                <p><strong>Description:</strong> SafeReach is an emergency contact system that allows people to quickly reach you in case of emergency through a simple QR code scan.</p>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Help & Support
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-1">How it works</h4>
                  <p className="text-sm text-blue-700">Share your unique QR code with trusted people. When they scan it, they'll see your emergency page and can start a chat with you directly.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-800 mb-1">Managing chats</h4>
                  <p className="text-sm text-green-700">All incoming chats appear in the "Chats" tab. You can reply to messages, mark them as read, or delete conversations.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-1">Emergency contacts</h4>
                  <p className="text-sm text-purple-700">Add trusted contacts who can be notified in case of emergency. These contacts are stored locally on your device.</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </h3>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Enable Notifications</span>
                <button
                  onClick={() => {
                    const updated = { ...settings, notificationsEnabled: !settings.notificationsEnabled };
                    setSettings(updated);
                    saveSettings(updated);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notificationsEnabled ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </label>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-4">Need help? Reach out to our support team.</p>
              <div className="flex gap-3">
                <a
                  href="mailto:support@saferch.app"
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-200 transition-colors"
                >
                  📧 Email Support
                </a>
                <a
                  href="#"
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-200 transition-colors"
                >
                  📖 Documentation
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
