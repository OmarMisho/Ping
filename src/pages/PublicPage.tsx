import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings } from '../storage';

const PublicPage: React.FC = () => {
  const navigate = useNavigate();
  const settings = getSettings();

  const handleStartChat = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl shadow-2xl shadow-red-200 flex items-center justify-center mx-auto transform hover:scale-105 transition-transform">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-6">SafeReach</h1>
          <p className="text-gray-500 mt-1">Emergency Contact System</p>
        </div>

        {/* Message Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/50">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {settings.emergencyMessage}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            If you need immediate assistance or have an emergency concern, don't hesitate to reach out. I'm here to help.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">How it works:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span>Visit this website</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span>Start a chat and send your message</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span>The owner receives it instantly on their app</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartChat}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-red-200 hover:shadow-2xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Start Emergency Chat
        </button>

        {/* Footer */}
        <div className="mt-8 text-gray-400 text-xs">
          <p>🔒 Your messages are private and secure</p>
          <p className="mt-1">Powered by SafeReach</p>
        </div>
      </div>
    </div>
  );
};

export default PublicPage;
